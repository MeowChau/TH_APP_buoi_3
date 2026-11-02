import { useCallback, useLayoutEffect } from 'react';
import * as courseService from '../api/courseService';
import * as sessionService from '../api/sessionService';
import * as assignmentService from '../api/assignmentService';
import * as gradeService from '../api/gradeService';
import { useAppData } from '../context/AppDataContext';
import useCachedQuery from './useCachedQuery';
import useNetworkStatus from './useNetworkStatus';
import type { Id } from '../types';
function newest<T>(
  detail: T | null,
  detailTime: string | null,
  shared: T | undefined,
  sharedTime: string | null,
): T | undefined {
  if (!detail) {
    return shared;
  }
  return shared && (sharedTime ?? '') > (detailTime ?? '') ? shared : detail;
}
export function useDetailTitle(
  navigation: { setOptions: (options: { title: string }) => void },
  title: string,
) {
  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);
}
export function useCourseDetail(id: Id) {
  const data = useAppData();
  const { isOnline } = useNetworkStatus();
  const fetcher = useCallback(() => courseService.getById(id), [id]);
  const query = useCachedQuery(`courses:${id}`, fetcher);
  const course = newest(
    query.data,
    query.lastUpdated,
    data.courses.find(item => String(item.id) === String(id)),
    data.courseQuery.lastUpdated,
  );
  return {
    ...query,
    course,
    loading:
      (query.loading && !course) ||
      data.sessionQuery.loading ||
      data.assignmentQuery.loading,
    refreshing:
      query.refreshing ||
      data.sessionQuery.refreshing ||
      data.assignmentQuery.refreshing,
    error:
      (!isOnline && course ? null : query.error) ??
      data.sessionQuery.error ??
      data.assignmentQuery.error,
    lastUpdated: query.lastUpdated ?? data.courseQuery.lastUpdated,
    sessions: data.sessions
      .filter(item => String(item.courseId) === String(id))
      .map(item => ({ ...item, course })),
    assignments: data.assignments.filter(
      item => String(item.courseId) === String(id),
    ),
    pendingAssignment: data.pendingAssignment,
    toggleAssignment: data.toggleAssignment,
    refresh: async () => {
      await Promise.all([
        query.refresh(),
        data.sessionQuery.refresh(),
        data.assignmentQuery.refresh(),
      ]);
    },
  };
}
export function useSessionDetail(id: Id) {
  const data = useAppData();
  const { isOnline } = useNetworkStatus();
  const fetcher = useCallback(() => sessionService.getById(id), [id]);
  const query = useCachedQuery(`sessions:${id}`, fetcher);
  const session = newest(
    query.data,
    query.lastUpdated,
    data.sessions.find(item => String(item.id) === String(id)),
    data.sessionQuery.lastUpdated,
  );
  return {
    ...query,
    session,
    loading: query.loading && !session,
    error: !isOnline && session ? null : query.error,
    lastUpdated: query.lastUpdated ?? data.sessionQuery.lastUpdated,
  };
}
export function useAssignmentDetail(id: Id) {
  const data = useAppData();
  const { isOnline } = useNetworkStatus();
  const pending = data.pendingAssignment(id);
  const shared = data.assignments.find(item => String(item.id) === String(id));
  const fetcher = useCallback(() => assignmentService.getById(id), [id]);
  const query = useCachedQuery(`assignments:${id}`, fetcher);
  const source = pending
    ? shared
    : newest(
        query.data,
        query.lastUpdated,
        shared,
        data.assignmentQuery.lastUpdated,
      );
  const assignment = source
    ? {
        ...source,
        course:
          data.courses.find(
            course => String(course.id) === String(source.courseId),
          ) ??
          source.course ??
          shared?.course,
      }
    : undefined;
  return {
    ...query,
    assignment,
    pending,
    toggleAssignment: data.toggleAssignment,
    loading: query.loading && !assignment,
    error: (!isOnline || pending) && assignment ? null : query.error,
    lastUpdated: query.lastUpdated ?? data.assignmentQuery.lastUpdated,
  };
}
export function useGradeDetail(id: Id) {
  const data = useAppData();
  const { isOnline } = useNetworkStatus();
  const fetcher = useCallback(() => gradeService.getById(id), [id]);
  const query = useCachedQuery(`grades:${id}`, fetcher);
  const grade = newest(
    query.data,
    query.lastUpdated,
    data.grades.find(item => String(item.id) === String(id)),
    data.gradeQuery.lastUpdated,
  );
  return {
    ...query,
    grade,
    loading: query.loading && !grade,
    error: !isOnline && grade ? null : query.error,
    lastUpdated: query.lastUpdated ?? data.gradeQuery.lastUpdated,
  };
}
