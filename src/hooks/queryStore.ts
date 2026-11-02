import { getCache, setCache } from '../storage/cache';
export type QueryState<T> = {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
};
type Entry<T> = {
  state: QueryState<T>;
  listeners: Set<() => void>;
  hydrated: boolean;
  hydration?: Promise<void>;
  flight?: Promise<void>;
  version: number;
};
const entries = new Map<string, Entry<unknown>>();
export function getQuery<T>(key: string): Entry<T> {
  if (!entries.has(key)) {
    entries.set(key, {
      state: {
        data: null,
        loading: true,
        refreshing: false,
        error: null,
        lastUpdated: null,
      },
      listeners: new Set(),
      hydrated: false,
      version: 0,
    });
  }
  return entries.get(key) as Entry<T>;
}
function publish<T>(entry: Entry<T>, patch: Partial<QueryState<T>>) {
  entry.state = { ...entry.state, ...patch };
  entry.listeners.forEach(listener => listener());
}
export const messageOf = (error: unknown) =>
  error && typeof error === 'object' && 'message' in error
    ? String(error.message)
    : 'Có lỗi xảy ra. Vui lòng thử lại.';
export async function hydrateQuery<T>(key: string) {
  const entry = getQuery<T>(key);
  if (entry.hydrated) {
    return;
  }
  if (!entry.hydration) {
    entry.hydration = getCache<T>(key)
      .then(cache => {
        if (cache && entry.state.data === null) {
          publish(entry, {
            data: cache.data,
            lastUpdated: cache.savedAt,
            loading: false,
          });
        }
        entry.hydrated = true;
      })
      .finally(() => {
        entry.hydration = undefined;
      });
  }
  await entry.hydration;
}
export async function runQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  isOnline: boolean,
  refreshing = false,
) {
  const entry = getQuery<T>(key);
  if (entry.flight) {
    return entry.flight;
  }
  entry.flight = (async () => {
    try {
      await hydrateQuery<T>(key);
    } catch {
      publish(entry, {
        error: 'Không đọc được bộ nhớ đệm. Kiểm tra dung lượng thiết bị.',
      });
    }
    if (!isOnline) {
      publish(entry, {
        loading: false,
        refreshing: false,
        error:
          entry.state.data === null
            ? 'Bạn đang offline và chưa có dữ liệu đã lưu. Kết nối mạng rồi thử lại.'
            : null,
      });
      return;
    }
    publish(entry, {
      loading: entry.state.data === null,
      refreshing,
      error: null,
    });
    const version = entry.version;
    try {
      const data = await fetcher();
      if (version !== entry.version) {
        return;
      }
      const savedAt = new Date().toISOString();
      publish(entry, { data, lastUpdated: savedAt, error: null });
      try {
        await setCache(key, data, savedAt);
      } catch {
        if (version === entry.version) {
          publish(entry, {
            error:
              'Đã tải dữ liệu nhưng chưa lưu được bộ nhớ đệm. Kiểm tra dung lượng thiết bị.',
          });
        }
      }
    } catch (error) {
      if (version === entry.version) {
        publish(entry, { error: messageOf(error) });
      }
    } finally {
      publish(entry, { loading: false, refreshing: false });
    }
  })().finally(() => {
    entry.flight = undefined;
  });
  return entry.flight;
}
export async function replaceQuery<T>(
  key: string,
  updater: (previous: T | null) => T,
) {
  const entry = getQuery<T>(key);
  await hydrateQuery<T>(key);
  entry.version += 1;
  const data = updater(entry.state.data);
  const savedAt = new Date().toISOString();
  await setCache(key, data, savedAt);
  publish(entry, { data, lastUpdated: savedAt, loading: false, error: null });
}
