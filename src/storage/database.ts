import { open, type DB } from '@op-engineering/op-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OUTBOX_KEY } from './keys';
import { decodeCache, decodeOutbox } from './codecs';
export const DATABASE_NAME = 'studyspace.sqlite';
let connection: DB | null = null;
let initialization: Promise<DB> | null = null;
let work: Promise<unknown> = Promise.resolve();
async function initialize(): Promise<DB> {
  if (!connection) {
    connection = open({ name: DATABASE_NAME });
  }
  const db = connection;
  await db.execute('PRAGMA journal_mode = WAL');
  await db.execute('PRAGMA synchronous = FULL');
  await db.execute(
    'CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)',
  );
  await db.execute(
    'CREATE TABLE IF NOT EXISTS query_cache (cache_key TEXT PRIMARY KEY NOT NULL, data_json TEXT NOT NULL, saved_at TEXT NOT NULL)',
  );
  await db.execute(
    "CREATE TABLE IF NOT EXISTS outbox (sequence INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE NOT NULL, method TEXT NOT NULL CHECK(method IN ('POST','PATCH')), url TEXT NOT NULL, body_json TEXT NOT NULL, created_at TEXT NOT NULL)",
  );
  await db.execute(
    'CREATE TABLE IF NOT EXISTS preferences (key TEXT PRIMARY KEY NOT NULL, value_json TEXT NOT NULL)',
  );
  const marker = await db.execute(
    "SELECT value FROM app_meta WHERE key = 'async-storage-import-v1'",
  );
  if (!marker.rows.length) {
    // Retain old storage as a backup. Commit the marker atomically with imported rows.
    const oldKeys = (await AsyncStorage.getAllKeys()).filter(key =>
      key.startsWith('cache:'),
    );
    const caches = await Promise.all(
      oldKeys.map(async key => ({
        key,
        value: await AsyncStorage.getItem(key),
      })),
    );
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    let actions;
    try {
      actions = decodeOutbox(raw ? JSON.parse(raw) : []);
    } catch {
      throw new Error(
        'Chưa chuyển được hàng đợi cũ sang SQLite vì dữ liệu không đọc được. Bản cũ vẫn được giữ nguyên.',
      );
    }
    await db.execute('BEGIN IMMEDIATE');
    try {
      for (const entry of caches) {
        const cache = entry.value ? decodeCache(entry.value) : null;
        if (cache) {
          await db.execute(
            'INSERT OR IGNORE INTO query_cache (cache_key, data_json, saved_at) VALUES (?, ?, ?)',
            [entry.key, JSON.stringify(cache.data), cache.savedAt],
          );
        }
      }
      for (const action of actions) {
        await db.execute(
          'INSERT OR IGNORE INTO outbox (id, method, url, body_json, created_at) VALUES (?, ?, ?, ?, ?)',
          [
            action.id,
            action.method,
            action.url,
            JSON.stringify(action.body),
            action.createdAt,
          ],
        );
      }
      await db.execute(
        "INSERT INTO app_meta (key, value) VALUES ('async-storage-import-v1', 'complete')",
      );
      await db.execute('PRAGMA user_version = 1');
      await db.execute('COMMIT');
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  }
  return db;
}
export function withDatabase<T>(callback: (db: DB) => Promise<T>): Promise<T> {
  const task = work
    .catch(() => {})
    .then(async () => {
      if (!initialization) {
        initialization = initialize().catch(error => {
          initialization = null;
          throw error;
        });
      }
      return callback(await initialization);
    });
  work = task;
  return task;
}
