import type { Assignment } from '../types';
export const REMINDER_PREFIX = 'study-deadline-';
export const REMINDER_LEAD_MS = 24 * 60 * 60 * 1000;
export const MAX_REMINDERS = 45;
export type ReminderPlan = {
  id: string;
  assignment: Assignment;
  timestamp: number;
  signature: string;
};
export function buildReminderPlan(
  assignments: Assignment[],
  now = Date.now(),
): ReminderPlan[] {
  return assignments
    .filter(item => item.status === 'todo')
    .map(assignment => ({
      id: `${REMINDER_PREFIX}${encodeURIComponent(assignment.id)}`,
      assignment,
      timestamp: Date.parse(assignment.dueDate) - REMINDER_LEAD_MS,
      signature: JSON.stringify([
        assignment.title,
        assignment.course?.name ?? '',
        assignment.dueDate,
      ]),
    }))
    .filter(item => Number.isFinite(item.timestamp) && item.timestamp > now)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(0, MAX_REMINDERS);
}
