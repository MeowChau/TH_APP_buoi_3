const two = (value: number) => String(value).padStart(2, '0');
export function formatDate(value: string | Date) {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? '—'
    : `${two(d.getDate())}/${two(d.getMonth() + 1)}/${d.getFullYear()}`;
}
export function formatTime(value: string | Date) {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? '—'
    : `${two(d.getHours())}:${two(d.getMinutes())}`;
}
export function isOverdue(due: string, status = 'todo', now = new Date()) {
  return status !== 'done' && new Date(due).getTime() < now.getTime();
}
export function daysLeft(due: string, now = new Date()) {
  const end = new Date(due);
  const start = new Date(now);
  end.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}
export function todayDay() {
  return new Date().getDay() === 0 ? 8 : new Date().getDay() + 1;
}
export function parseLocalDate(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day, 23, 59, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date.toISOString();
}
