import { withDatabase } from './database';
import { decodeOutbox } from './codecs';
import type { OutboxAction } from '../types';
let actions: OutboxAction[] = [];
let hydrated = false;
let hydration: Promise<void> | null = null;
let transaction: Promise<unknown> = Promise.resolve();
const listeners = new Set<() => void>();
const publish = (next: OutboxAction[]) => {
  actions = next;
  listeners.forEach(listener => listener());
};
export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getSnapshot = () => actions;
export function hydrate(): Promise<void> {
  if (hydrated) {
    return Promise.resolve();
  }
  if (!hydration) {
    hydration = withDatabase(async db => {
      const { rows } = await db.execute(
        'SELECT id, method, url, body_json, created_at FROM outbox ORDER BY sequence ASC',
      );
      const restored = decodeOutbox(
        rows.map(row => ({
          id: row.id,
          method: row.method,
          url: row.url,
          body: JSON.parse(String(row.body_json)),
          createdAt: row.created_at,
        })),
      );
      hydrated = true;
      publish(restored);
    }).finally(() => {
      hydration = null;
    });
  }
  return hydration;
}
export async function getAll() {
  await hydrate();
  await transaction.catch(() => {});
  return [...actions];
}
function change(action: OutboxAction | string) {
  const task = transaction
    .catch(() => {})
    .then(async () => {
      await hydrate();
      const previous = actions;
      if (typeof action !== 'string') {
        publish([...previous, action]);
      }
      try {
        await withDatabase(async db => {
          if (typeof action === 'string') {
            await db.execute('DELETE FROM outbox WHERE id = ?', [action]);
          } else {
            await db.execute(
              'INSERT INTO outbox (id, method, url, body_json, created_at) VALUES (?, ?, ?, ?, ?)',
              [
                action.id,
                action.method,
                action.url,
                JSON.stringify(action.body),
                action.createdAt,
              ],
            );
          }
        });
      } catch {
        publish(previous);
        throw new Error(
          'Chưa lưu được thao tác vào SQLite. Kiểm tra dung lượng rồi thử lại.',
        );
      }
      if (typeof action === 'string') {
        publish(previous.filter(item => item.id !== action));
      }
    });
  transaction = task;
  return task;
}
export const enqueue = (action: OutboxAction) => change(action);
export const remove = (id: string) => change(id);
