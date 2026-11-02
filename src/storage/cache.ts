import { cacheKey } from './keys';
import { withDatabase } from './database';
import { decodeCache } from './codecs';
import type { CacheEntry } from '../types';
export async function getCache<T>(key: string): Promise<CacheEntry<T> | null> {
  return withDatabase(async db => {
    const { rows } = await db.execute(
      'SELECT data_json, saved_at FROM query_cache WHERE cache_key = ?',
      [cacheKey(key)],
    );
    if (!rows.length) {
      return null;
    }
    return decodeCache<T>(
      JSON.stringify({
        data: JSON.parse(String(rows[0].data_json)),
        savedAt: rows[0].saved_at,
      }),
    );
  });
}
export async function setCache<T>(
  key: string,
  data: T,
  savedAt = new Date().toISOString(),
): Promise<void> {
  await withDatabase(async db => {
    await db.execute(
      'INSERT INTO query_cache (cache_key, data_json, saved_at) VALUES (?, ?, ?) ON CONFLICT(cache_key) DO UPDATE SET data_json = excluded.data_json, saved_at = excluded.saved_at',
      [cacheKey(key), JSON.stringify(data), savedAt],
    );
  });
}
