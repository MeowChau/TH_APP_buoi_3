import AsyncStorage from '@react-native-async-storage/async-storage';
import * as assignments from '../src/api/assignmentService';
import * as students from '../src/api/studentService';
import * as outbox from '../src/storage/outbox';
import { drainOutbox } from '../src/hooks/syncEngine';
import { getQuery } from '../src/hooks/queryStore';
import { withDatabase } from '../src/storage/database';
import type { Assignment, OutboxAction, Student } from '../src/types';
jest.mock('../src/api/assignmentService');
jest.mock('../src/api/studentService');
const original = {
  id: 1,
  courseId: 1,
  title: 'Bài tập',
  description: '',
  dueDate: '2026-11-09T23:59:00Z',
  status: 'todo',
  updatedAt: '2026-10-20T08:00:00Z',
} as Assignment;
const action = (
  id: string,
  url = '/assignments/1',
  body: Record<string, unknown> = { status: 'done' },
  method: 'PATCH' | 'POST' = 'PATCH',
): OutboxAction => ({
  id,
  url,
  body: { ...body, updatedAt: '2026-10-26T08:00:00Z' },
  method,
  createdAt: '2026-10-26T08:00:00Z',
});
beforeEach(async () => {
  for (const item of await outbox.getAll()) {
    await outbox.remove(item.id);
  }
  await AsyncStorage.clear();
  jest.clearAllMocks();
  jest.mocked(assignments.getById).mockResolvedValue(original);
  jest
    .mocked(assignments.update)
    .mockImplementation(async (_id, data) => ({ ...original, ...data }));
});
test('Offline: 2 PATCH + 1 POST được lưu bền và gửi đúng thứ tự', async () => {
  const changes = [
    action('one'),
    action('two', '/assignments/2'),
    action('three', '/assignments', { ...original, id: 'client-3' }, 'POST'),
  ];
  for (const item of changes) {
    await outbox.enqueue(item);
  }
  expect(
    (
      await withDatabase(db =>
        db.execute('SELECT id FROM outbox ORDER BY sequence'),
      )
    ).rows.map(item => item.id),
  ).toEqual(['one', 'two', 'three']);
  expect(await drainOutbox(() => false)).toMatchObject({ count: 0 });
  const order: string[] = [];
  jest.mocked(assignments.getById).mockImplementation(async id => {
    if (id === 'client-3') {
      throw { type: 'http', status: 404 };
    }
    return { ...original, id };
  });
  jest.mocked(assignments.update).mockImplementation(async (id, data) => {
    order.push(`PATCH ${id}`);
    return { ...original, ...data, id };
  });
  jest.mocked(assignments.create).mockImplementation(async data => {
    order.push('POST');
    return data as Assignment;
  });
  expect(await drainOutbox(() => true)).toMatchObject({
    count: 3,
    conflicts: 0,
  });
  expect(order).toEqual(['PATCH 1', 'PATCH 2', 'POST']);
  expect(await outbox.getAll()).toEqual([]);
});
test('Lỗi giữ nguyên đầu hàng đợi, không gửi vượt thứ tự', async () => {
  await outbox.enqueue(action('fail'));
  await outbox.enqueue(action('later', '/assignments/2'));
  jest
    .mocked(assignments.getById)
    .mockRejectedValue({ type: 'network', message: 'Mất mạng' });
  expect((await drainOutbox(() => true)).failure?.actionId).toBe('fail');
  expect((await outbox.getAll()).map(item => item.id)).toEqual([
    'fail',
    'later',
  ]);
  expect(assignments.update).not.toHaveBeenCalled();
});
test('Xung đột hồ sơ: ưu tiên server mới hơn, không PATCH', async () => {
  const remote = {
    id: 1,
    fullName: 'Tên mới trên server',
    updatedAt: '2026-10-27T08:00:00Z',
  } as Student;
  jest.mocked(students.getById).mockResolvedValue(remote);
  await outbox.enqueue(
    action('profile', '/students/1', { fullName: 'Tên offline' }),
  );
  expect(await drainOutbox(() => true)).toMatchObject({
    count: 0,
    conflicts: 1,
  });
  expect(students.update).not.toHaveBeenCalled();
  expect(getQuery('students:1').state.data).toEqual(remote);
  expect(await outbox.getAll()).toEqual([]);
});
test('POST gửi lại không tạo bản ghi trùng nếu server đã lưu', async () => {
  await outbox.enqueue(
    action(
      'post',
      '/assignments',
      { ...original, id: 'client-existing' },
      'POST',
    ),
  );
  jest
    .mocked(assignments.getById)
    .mockResolvedValue({ ...original, id: 'client-existing' });
  expect(await drainOutbox(() => true)).toMatchObject({ count: 1 });
  expect(assignments.create).not.toHaveBeenCalled();
});
test('Hai yêu cầu đồng bộ cùng lúc dùng chung một lượt gửi', async () => {
  await outbox.enqueue(action('single'));
  const first = drainOutbox(() => true);
  const second = drainOutbox(() => true);
  expect(first).toBe(second);
  await Promise.all([first, second]);
  expect(assignments.update).toHaveBeenCalledTimes(1);
});
test('Hết dung lượng khi enqueue: hoàn tác bộ nhớ, không mất hàng đợi cũ', async () => {
  await outbox.enqueue(action('kept'));
  await withDatabase(async db => {
    jest.spyOn(db, 'execute').mockRejectedValueOnce(new Error('Disk full'));
  });
  await expect(outbox.enqueue(action('not-saved'))).rejects.toThrow(
    'Chưa lưu được',
  );
  expect(outbox.getSnapshot().map(item => item.id)).toEqual(['kept']);
});
