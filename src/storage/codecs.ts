import type { CacheEntry, OutboxAction } from '../types';
export function decodeCache<T>(raw: string): CacheEntry<T> | null {
  try {
    const value = JSON.parse(raw);
    return value &&
      typeof value === 'object' &&
      'data' in value &&
      Number.isFinite(Date.parse(value.savedAt))
      ? value
      : null;
  } catch {
    return null;
  }
}
export function decodeOutbox(value: unknown): OutboxAction[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      item =>
        item &&
        typeof item.id === 'string' &&
        ['POST', 'PATCH'].includes(item.method) &&
        typeof item.url === 'string' &&
        item.body &&
        typeof item.body === 'object' &&
        Number.isFinite(Date.parse(item.createdAt)),
    )
  ) {
    throw new Error(
      'Hàng đợi đã lưu không đọc được. Dữ liệu được giữ nguyên để tránh mất thao tác.',
    );
  }
  return value;
}
