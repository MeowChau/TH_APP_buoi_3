import React, { createContext, useCallback, useContext, useMemo } from 'react';
import * as studentService from '../api/studentService';
import * as courseService from '../api/courseService';
import * as sessionService from '../api/sessionService';
import * as assignmentService from '../api/assignmentService';
import * as gradeService from '../api/gradeService';
import useCachedQuery from '../hooks/useCachedQuery';
import * as outbox from '../storage/outbox';
import { keys } from '../storage/keys';
import { useSync } from './SyncContext';
import { validateAssignment, validateProfile } from '../utils/validators';
import { messageOf } from '../hooks/queryStore';
import useAssignmentReminders from '../hooks/useAssignmentReminders';
import type {
  ApiError,
  Assignment,
  AssignmentInput,
  Id,
  OutboxAction,
  ProfileInput,
  Student,
} from '../types';
const getStudent = () => studentService.getById(1);
function useAppDataValue() {
  const studentQuery = useCachedQuery(keys.student, getStudent);
  const courseQuery = useCachedQuery(keys.courses, courseService.getAll);
  const sessionQuery = useCachedQuery(keys.sessions, sessionService.getAll);
  const assignmentQuery = useCachedQuery(
    keys.assignments,
    assignmentService.getAll,
  );
  const gradeQuery = useCachedQuery(keys.grades, gradeService.getAll);
  const sync = useSync();
  const student = useMemo(
    () =>
      sync.actions.reduce<Student | null>(
        (value, action) =>
          action.url === '/students/1' && value
            ? ({ ...value, ...action.body } as Student)
            : value,
        studentQuery.data,
      ),
    [sync.actions, studentQuery.data],
  );
  const courses = useMemo(() => courseQuery.data ?? [], [courseQuery.data]);
  const assignments = useMemo(() => {
    let list = [...(assignmentQuery.data ?? [])];
    for (const action of sync.actions) {
      if (action.url === '/assignments' && action.method === 'POST') {
        const entity = action.body as Assignment;
        if (!list.some(item => String(item.id) === String(entity.id))) {
          list.push(entity);
        }
      } else if (action.url.startsWith('/assignments/')) {
        const id = decodeURIComponent(action.url.split('/').pop()!);
        list = list.map(item =>
          String(item.id) === id
            ? ({ ...item, ...action.body } as Assignment)
            : item,
        );
      }
    }
    return list
      .map(item => ({
        ...item,
        course:
          courses.find(course => String(course.id) === String(item.courseId)) ??
          item.course,
      }))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [assignmentQuery.data, sync.actions, courses]);
  const submit = useCallback(
    async (action: OutboxAction) => {
      await outbox.enqueue(action);
      if (sync.isOnline) {
        const report = await sync.syncNow();
        if (
          report.failure?.actionId === action.id &&
          (report.failure.error as ApiError).type === 'http' &&
          (report.failure.error as ApiError).status >= 400
        ) {
          await outbox.remove(action.id);
          sync.dismissMessage();
          throw new Error(
            `${messageOf(report.failure.error)} Đã hoàn tác thay đổi.`,
          );
        }
      }
    },
    [sync],
  );
  const makeAction = (
    method: 'POST' | 'PATCH',
    url: string,
    body: Record<string, unknown>,
  ): OutboxAction => {
    const createdAt = new Date().toISOString();
    return {
      id: `change-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      method,
      url,
      body: { ...body, updatedAt: createdAt },
      createdAt,
    };
  };
  async function toggleAssignment(id: Id) {
    const current = assignments.find(item => String(item.id) === String(id));
    if (!current) {
      throw new Error('Không tìm thấy bài tập.');
    }
    await submit(
      makeAction('PATCH', `/assignments/${encodeURIComponent(id)}`, {
        status: current.status === 'done' ? 'todo' : 'done',
      }),
    );
  }
  async function addAssignment(input: AssignmentInput) {
    if (Object.keys(validateAssignment(input)).length) {
      throw new Error('Kiểm tra lại tiêu đề, môn học và hạn nộp.');
    }
    const id = `assignment-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    await submit(
      makeAction('POST', '/assignments', {
        ...input,
        title: input.title.trim(),
        description: input.description.trim(),
        id,
        status: 'todo',
      }),
    );
  }
  async function updateProfile(input: ProfileInput) {
    if (Object.keys(validateProfile(input)).length) {
      throw new Error('Thông tin cá nhân chưa hợp lệ.');
    }
    await submit(
      makeAction('PATCH', '/students/1', {
        fullName: input.fullName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
      }),
    );
  }
  const pendingAssignment = (id: Id) =>
    sync.actions.some(
      action =>
        action.url === `/assignments/${encodeURIComponent(id)}` ||
        (action.url === '/assignments' &&
          String(action.body.id) === String(id)),
    );
  const pendingProfile = sync.actions.some(
    action => action.url === '/students/1',
  );
  const reminders = useAssignmentReminders(
    assignments,
    assignmentQuery.data !== null && sync.ready,
  );
  return {
    reminders,
    student,
    courses,
    assignments,
    sessions: sessionQuery.data ?? [],
    grades: gradeQuery.data ?? [],
    studentQuery,
    courseQuery,
    sessionQuery,
    assignmentQuery,
    gradeQuery,
    toggleAssignment,
    addAssignment,
    updateProfile,
    pendingAssignment,
    pendingProfile,
  };
}
const AppDataContext = createContext<ReturnType<typeof useAppDataValue> | null>(
  null,
);
/** @param children - Nội dung ứng dụng bắt buộc. */
export default function AppDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useAppDataValue();
  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('Thiếu AppDataProvider.');
  }
  return value;
}
