export const OUTBOX_KEY = '@studyspace/th4/outbox-v1';
export const cacheKey = (key: string) => `cache:${key}`;
export const keys = {
  student: 'students:1',
  courses: 'courses',
  sessions: 'sessions',
  assignments: 'assignments',
  grades: 'grades',
} as const;
