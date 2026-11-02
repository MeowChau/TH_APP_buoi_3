import { withDatabase } from './database';
export async function getPreference<T>(key: string, fallback: T): Promise<T> {
  return withDatabase(async db => {
    const { rows } = await db.execute(
      'SELECT value_json FROM preferences WHERE key = ?',
      [key],
    );
    if (!rows.length) {
      return fallback;
    }
    return JSON.parse(String(rows[0].value_json)) as T;
  });
}
export async function setPreference<T>(key: string, value: T): Promise<void> {
  await withDatabase(async db => {
    await db.execute(
      'INSERT INTO preferences (key, value_json) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json',
      [key, JSON.stringify(value)],
    );
  });
}
