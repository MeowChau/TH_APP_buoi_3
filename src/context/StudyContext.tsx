import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { createInitialState } from '../data/seed';
import { Profile, StudyState } from '../types';

export const STORAGE_KEY = '@studyspace/state-v1';
export function restoreState(raw: string): StudyState {
  const value: unknown = JSON.parse(raw);
  const seed = createInitialState();
  if (
    !value ||
    typeof value !== 'object' ||
    !('version' in value) ||
    value.version !== 1 ||
    !('profile' in value) ||
    !('assignments' in value)
  ) {
    throw new Error('Dữ liệu lưu không hợp lệ.');
  }
  const saved = value as StudyState;
  if (
    !saved.profile ||
    !Object.keys(seed.profile).every(
      key => typeof saved.profile[key as keyof Profile] === 'string',
    ) ||
    !Array.isArray(saved.assignments)
  ) {
    throw new Error('Dữ liệu lưu không hợp lệ.');
  }
  // Keep the canonical assignment content, restoring only known IDs and mutable fields.
  const assignments = seed.assignments.map(item => {
    const stored = saved.assignments.find(
      candidate => candidate?.id === item.id,
    );
    if (
      !stored ||
      typeof stored.completed !== 'boolean' ||
      typeof stored.due !== 'string' ||
      !Number.isFinite(Date.parse(stored.due))
    ) {
      throw new Error('Dữ liệu bài tập không hợp lệ.');
    }
    return { ...item, due: stored.due, completed: stored.completed };
  });
  return {
    ...seed,
    profile: {
      ...seed.profile,
      name: saved.profile.name,
      email: saved.profile.email,
      phone: saved.profile.phone,
    },
    assignments,
  };
}

type ContextValue = {
  state: StudyState;
  loading: boolean;
  storageError: string | null;
  now: Date;
  retry: () => void;
  toggleAssignment: (id: string) => Promise<void>;
  updateProfile: (
    fields: Pick<Profile, 'name' | 'email' | 'phone'>,
  ) => Promise<void>;
};
const StudyContext = createContext<ContextValue | null>(null);
export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(createInitialState);
  const current = useRef(state);
  const hydrated = useRef(false);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    let active = true;
    setLoading(true);
    hydrated.current = false;
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const restored = raw ? restoreState(raw) : createInitialState();
        if (!raw) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
        }
        if (active) {
          current.current = restored;
          setState(restored);
          setStorageError(null);
          hydrated.current = true;
        }
      } catch {
        if (active) {
          setStorageError(
            'Không thể đọc dữ liệu đã lưu. Kiểm tra bộ nhớ rồi thử lại.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [attempt]);
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = setInterval(refresh, 60000);
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'active') {
        refresh();
      }
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
  const persist = useCallback(
    (change: (previous: StudyState) => StudyState) => {
      const task = queue.current.then(async () => {
        if (!hydrated.current) {
          throw new Error('Chưa đọc được dữ liệu. Hãy nhấn Thử lại.');
        }
        const next = change(current.current);
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          setStorageError(
            'Không thể lưu thay đổi. Dữ liệu trước đó vẫn được giữ.',
          );
          throw new Error(
            'Không thể lưu. Vui lòng kiểm tra bộ nhớ và thử lại.',
          );
        }
        current.current = next;
        setState(next);
        setStorageError(null);
      });
      queue.current = task.catch(() => {});
      return task;
    },
    [],
  );
  const toggleAssignment = useCallback(
    (id: string) =>
      persist(previous => ({
        ...previous,
        assignments: previous.assignments.map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item,
        ),
      })),
    [persist],
  );
  const updateProfile = useCallback(
    (fields: Pick<Profile, 'name' | 'email' | 'phone'>) =>
      persist(previous => ({
        ...previous,
        profile: { ...previous.profile, ...fields },
      })),
    [persist],
  );
  return (
    <StudyContext.Provider
      value={{
        state,
        loading,
        storageError,
        now,
        retry: () => setAttempt(value => value + 1),
        toggleAssignment,
        updateProfile,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}
export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('StudyProvider is missing');
  }
  return context;
}
