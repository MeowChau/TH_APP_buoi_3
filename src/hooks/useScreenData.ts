import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useSync } from '../context/SyncContext';
import { normalize } from '../utils/validators';
import { isOverdue, todayDay } from '../utils/date';
import { calcGpa } from '../utils/gpa';
import type { QueryState } from './queryStore';
type Query = QueryState<unknown> & { refresh: () => Promise<void> };
export function combineQueries(queries: Query[]) {
  const dates = queries
    .map(query => query.lastUpdated)
    .filter((value): value is string => Boolean(value))
    .sort();
  return {
    loading: queries.some(query => query.loading),
    error: queries.find(query => query.error)?.error ?? null,
    refreshing: queries.some(query => query.refreshing),
    lastUpdated: dates[0] ?? null,
    refresh: async () => {
      await Promise.all(queries.map(query => query.refresh()));
    },
  };
}
export function useHomeData() {
  const data = useAppData();
  const sync = useSync();
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 7);
  const upcoming = data.assignments.filter(
    item =>
      item.status === 'todo' &&
      new Date(item.dueDate) >= now &&
      new Date(item.dueDate) <= end,
  );
  return {
    ...data,
    ...combineQueries([
      data.studentQuery,
      data.courseQuery,
      data.assignmentQuery,
    ]),
    upcoming,
    pendingCount: sync.pendingCount,
    syncing: sync.syncing,
    syncNow: sync.syncNow,
    totalCredits: data.courses.reduce((sum, course) => sum + course.credits, 0),
  };
}
export function useCourseList() {
  const data = useAppData();
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');
  const semesters = Array.from(
    new Set(data.courses.map(course => course.semester)),
  );
  return {
    ...data.courseQuery,
    search,
    setSearch,
    semester,
    setSemester,
    options: [
      { value: 'all', label: 'Tất cả học kỳ' },
      ...semesters.map(value => ({ value, label: value })),
    ],
    courses: data.courses.filter(
      course =>
        normalize(`${course.name} ${course.code}`).includes(
          normalize(search),
        ) &&
        (semester === 'all' || course.semester === semester),
    ),
  };
}
export function useSchedule() {
  const data = useAppData();
  const [selectedDay, setSelectedDay] = useState(todayDay);
  return {
    ...data.sessionQuery,
    selectedDay,
    setSelectedDay,
    sessions: data.sessions
      .filter(item => item.dayOfWeek === selectedDay)
      .map(item => ({
        ...item,
        course:
          data.courses.find(
            course => String(course.id) === String(item.courseId),
          ) ?? item.course,
      }))
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  };
}
export function useAssignmentList() {
  const data = useAppData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const assignments = data.assignments.filter(
    item =>
      normalize(`${item.title} ${item.course?.name ?? ''}`).includes(
        normalize(search),
      ) &&
      (status === 'all' || status === 'overdue'
        ? status === 'all' || isOverdue(item.dueDate, item.status)
        : item.status === status),
  );
  return {
    ...data,
    ...data.assignmentQuery,
    search,
    setSearch,
    status,
    setStatus,
    filtered: assignments,
    options: [
      { value: 'all', label: 'Tất cả' },
      { value: 'todo', label: 'Chưa xong' },
      { value: 'done', label: 'Đã xong' },
      { value: 'overdue', label: 'Quá hạn' },
    ],
  };
}
export function useGrades() {
  const data = useAppData();
  const [semester, setSemester] = useState('all');
  const grades = data.grades
    .filter(item => semester === 'all' || item.semester === semester)
    .map(item => ({
      ...item,
      course:
        data.courses.find(
          course => String(course.id) === String(item.courseId),
        ) ?? item.course,
    }));
  const semesters = Array.from(new Set(data.grades.map(item => item.semester)));
  return {
    ...combineQueries([data.gradeQuery, data.courseQuery]),
    grades,
    semester,
    setSemester,
    summary: calcGpa(grades, data.courses),
    options: [
      { value: 'all', label: 'Tất cả học kỳ' },
      ...semesters.map(value => ({ value, label: value })),
    ],
  };
}
export function useProfileData() {
  const data = useAppData();
  return {
    ...data,
    ...combineQueries([data.studentQuery, data.gradeQuery, data.courseQuery]),
    summary: calcGpa(data.grades, data.courses),
  };
}
