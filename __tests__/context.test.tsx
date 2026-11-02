import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { useNetInfo } from '@react-native-community/netinfo';
import AppDataProvider, { useAppData } from '../src/context/AppDataContext';
import SyncProvider, { useSync } from '../src/context/SyncContext';
import type { Assignment, Student } from '../src/types';
const sample = require('../db.json');
let model: ReturnType<typeof useAppData>;
let synchronization: ReturnType<typeof useSync>;
function Probe() {
  model = useAppData();
  synchronization = useSync();
  return null;
}
function Harness() {
  return (
    <SyncProvider>
      <AppDataProvider>
        <Probe />
      </AppDataProvider>
    </SyncProvider>
  );
}
test('Context chia sẻ optimistic update, rollback HTTP, offline và tự đồng bộ khi nối lại mạng', async () => {
  const db = JSON.parse(JSON.stringify(sample)) as Record<string, any[]>;
  const network = jest.mocked(useNetInfo)();
  let rejectPatch: (() => void) | null = null;
  let shouldHold = false;
  globalThis.fetch = jest.fn(async (url, options) => {
    const [resource, id] = String(url)
      .replace(/^https?:\/\/[^/]+\//, '')
      .split('?')[0]
      .split('/');
    const list = db[resource];
    const found = list?.find(item => String(item.id) === id);
    if (options?.method === 'PATCH' && shouldHold) {
      await new Promise<void>(resolve => {
        rejectPatch = resolve;
      });
      return { ok: false, status: 400, json: async () => ({}) } as Response;
    }
    let result;
    if (options?.method === 'POST') {
      result = JSON.parse(String(options.body));
      list.push(result);
    } else if (options?.method === 'PATCH' && found) {
      Object.assign(found, JSON.parse(String(options.body)));
      result = found;
    } else {
      result = id ? found : list;
    }
    const expand = (entity: any) =>
      entity?.courseId
        ? {
            ...entity,
            course: db.courses.find(course => course.id === entity.courseId),
          }
        : entity;
    return {
      ok: Boolean(result),
      status: result ? 200 : 404,
      json: async () =>
        JSON.parse(
          JSON.stringify(
            Array.isArray(result) ? result.map(expand) : expand(result),
          ),
        ),
    } as Response;
  });
  let tree!: renderer.ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<Harness />);
  });
  expect(model.student?.fullName).toBe('Nguyễn Minh Anh');
  const original = model.assignments.find(item => item.id === 1)!.status;
  shouldHold = true;
  let operation!: Promise<void>;
  await act(async () => {
    operation = model.toggleAssignment(1);
    operation.catch(() => {});
  });
  expect(model.assignments.find(item => item.id === 1)?.status).not.toBe(
    original,
  );
  expect(rejectPatch).not.toBeNull();
  await act(async () => {
    rejectPatch!();
    await expect(operation).rejects.toThrow('Đã hoàn tác');
  });
  expect(model.assignments.find(item => item.id === 1)?.status).toBe(original);
  shouldHold = false;
  jest.mocked(useNetInfo).mockReturnValue({ ...network, isConnected: false });
  await act(async () => {
    tree.update(<Harness />);
  });
  const calls = jest.mocked(globalThis.fetch).mock.calls.length;
  await act(async () => {
    await model.toggleAssignment(1);
    await model.toggleAssignment(2);
    await model.addAssignment({
      courseId: 1,
      title: 'Bài thêm khi offline',
      description: 'Ôn tập',
      dueDate: '2099-11-09T23:59:00Z',
    });
  });
  expect(synchronization.pendingCount).toBe(3);
  expect(jest.mocked(globalThis.fetch).mock.calls.length).toBe(calls);
  expect(
    model.assignments.filter(item => model.pendingAssignment(item.id)),
  ).toHaveLength(3);
  await act(async () => {
    await model.updateProfile({
      fullName: 'Tên chỉnh offline',
      email: 'anh@sv.edu.vn',
      phone: '0912345678',
    });
  });
  expect(model.student?.fullName).toBe('Tên chỉnh offline');
  db.students[0].fullName = 'Tên mới hơn trên server';
  db.students[0].updatedAt = '2099-12-01T00:00:00Z';
  jest.mocked(useNetInfo).mockReturnValue(network);
  await act(async () => {
    tree.update(<Harness />);
  });
  expect(synchronization.pendingCount).toBe(0);
  expect(synchronization.message).toContain('Đã đồng bộ 3 thay đổi');
  expect(synchronization.message).toContain('xung đột');
  expect(model.student?.fullName).toBe('Tên mới hơn trên server');
  expect(
    (db.assignments as Assignment[]).find(item => item.id === 1)?.status,
  ).toBe('done');
  expect((db.students[0] as Student).fullName).toBe('Tên mới hơn trên server');
  expect(
    db.assignments.filter(item => item.title === 'Bài thêm khi offline'),
  ).toHaveLength(1);
  await act(async () => {
    tree.unmount();
  });
  jest.mocked(useNetInfo).mockReturnValue(network);
});
