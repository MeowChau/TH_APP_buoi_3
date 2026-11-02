import * as assignmentService from '../api/assignmentService';
import * as studentService from '../api/studentService';
import * as outbox from '../storage/outbox';
import { keys } from '../storage/keys';
import { replaceQuery } from './queryStore';
import type { ApiError, Assignment, OutboxAction, Student } from '../types';
export type SyncReport = {
  count: number;
  conflicts: number;
  failure?: { actionId: string; error: unknown };
};
let running: Promise<SyncReport> | null = null;
export async function commitAssignment(entity: Assignment) {
  await replaceQuery<Assignment[]>(keys.assignments, previous => {
    const list = [...(previous ?? [])];
    const index = list.findIndex(item => String(item.id) === String(entity.id));
    if (index < 0) {
      list.push(entity);
    } else {
      list[index] = { ...list[index], ...entity };
    }
    return list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  });
  await replaceQuery<Assignment>(`assignments:${entity.id}`, () => entity);
}
export async function commitStudent(entity: Student) {
  await replaceQuery<Student>(keys.student, () => entity);
}
async function execute(action: OutboxAction): Promise<boolean> {
  if (action.url === '/assignments' && action.method === 'POST') {
    // A stable client ID makes replay after a timeout or app termination idempotent.
    let entity: Assignment;
    try {
      entity = await assignmentService.getById(String(action.body.id));
    } catch (error) {
      if (
        (error as ApiError).type !== 'http' ||
        (error as ApiError).status !== 404
      ) {
        throw error;
      }
      entity = await assignmentService.create(action.body);
    }
    await commitAssignment(entity);
    return false;
  }
  const student = action.url === '/students/1';
  if (!student && !/^\/assignments\/[^/]+$/.test(action.url)) {
    throw new Error('Địa chỉ thao tác trong hàng đợi không hợp lệ.');
  }
  const id = decodeURIComponent(action.url.split('/').pop()!);
  const remote = student
    ? await studentService.getById(1)
    : await assignmentService.getById(id);
  const conflict = Date.parse(remote.updatedAt) > Date.parse(action.createdAt);
  if (student) {
    await commitStudent(
      conflict
        ? (remote as Student)
        : await studentService.update(1, action.body),
    );
  } else {
    await commitAssignment(
      conflict
        ? (remote as Assignment)
        : await assignmentService.update(id, action.body),
    );
  }
  return conflict;
}
export function drainOutbox(isOnline: () => boolean): Promise<SyncReport> {
  if (running) {
    return running;
  }
  running = (async () => {
    const report: SyncReport = { count: 0, conflicts: 0 };
    while (isOnline()) {
      const action = (await outbox.getAll())[0];
      if (!action) {
        break;
      }
      try {
        const conflict = await execute(action);
        await outbox.remove(action.id);
        if (conflict) {
          report.conflicts += 1;
        } else {
          report.count += 1;
        }
      } catch (error) {
        report.failure = { actionId: action.id, error };
        break;
      }
    }
    return report;
  })().finally(() => {
    running = null;
  });
  return running;
}
