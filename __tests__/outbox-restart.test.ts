beforeEach(() => {
  jest.resetModules();
  require('./support/sqliteMock.cjs').reset();
});
test('Khởi động lại đọc hàng đợi SQLite; POST rồi PATCH giữ đúng thứ tự', async () => {
  const box =
    require('../src/storage/outbox') as typeof import('../src/storage/outbox');
  await box.enqueue({
    id: 'new',
    method: 'POST',
    url: '/assignments',
    body: { id: 'client-new', title: 'Bài mới' },
    createdAt: '2026-11-02T10:00:00Z',
  });
  await box.enqueue({
    id: 'toggle',
    method: 'PATCH',
    url: '/assignments/client-new',
    body: { status: 'done' },
    createdAt: '2026-11-02T10:01:00Z',
  });
  jest.resetModules();
  const restored = require('../src/storage/outbox') as typeof box;
  expect((await restored.getAll()).map(item => item.id)).toEqual([
    'new',
    'toggle',
  ]);
});
test('Nâng cấp từ AsyncStorage: chuyển cache và outbox nguyên tử, không nhập lại thao tác đã gửi', async () => {
  const storage = require('@react-native-async-storage/async-storage').default;
  const { OUTBOX_KEY } = require('../src/storage/keys');
  const action = {
    id: 'legacy',
    method: 'PATCH',
    url: '/assignments/1',
    body: { status: 'done' },
    createdAt: '2026-11-02T10:00:00Z',
  };
  await storage.setItem(
    'cache:courses',
    JSON.stringify({
      data: [{ id: 1, name: 'Môn học cũ' }],
      savedAt: '2026-11-02T08:00:00Z',
    }),
  );
  await storage.setItem(OUTBOX_KEY, JSON.stringify([action]));
  const box =
    require('../src/storage/outbox') as typeof import('../src/storage/outbox');
  const cache =
    require('../src/storage/cache') as typeof import('../src/storage/cache');
  expect(await box.getAll()).toEqual([action]);
  expect((await cache.getCache<any[]>('courses'))?.data[0].name).toBe(
    'Môn học cũ',
  );
  await box.remove('legacy');
  jest.resetModules();
  const restored = require('../src/storage/outbox') as typeof box;
  expect(await restored.getAll()).toEqual([]);
});
test('Migration lỗi giữa chừng rollback; lần sau nhập lại đúng một lần', async () => {
  const storage = require('@react-native-async-storage/async-storage').default;
  const { OUTBOX_KEY } = require('../src/storage/keys');
  await storage.setItem(
    OUTBOX_KEY,
    JSON.stringify([
      {
        id: 'safe',
        method: 'PATCH',
        url: '/students/1',
        body: { fullName: 'Tên offline' },
        createdAt: '2026-11-02T10:00:00Z',
      },
    ]),
  );
  const native = require('@op-engineering/op-sqlite');
  const original = native.open.getMockImplementation();
  let fail = true;
  native.open.mockImplementation((options: any) => {
    const db = original(options);
    const execute = db.execute;
    db.execute = jest.fn(async (sql: string, args: any[]) => {
      if (fail && sql.includes('INSERT INTO app_meta')) {
        fail = false;
        throw new Error('Disk full');
      }
      return execute(sql, args);
    });
    return db;
  });
  const box =
    require('../src/storage/outbox') as typeof import('../src/storage/outbox');
  await expect(box.hydrate()).rejects.toThrow('Disk full');
  const rawConnection = native.open.mock.results[0].value;
  expect((await rawConnection.execute('SELECT id FROM outbox')).rows).toEqual([]);
  expect((await rawConnection.execute("SELECT value FROM app_meta WHERE key = 'async-storage-import-v1'")).rows).toEqual([]);
  expect((await box.getAll()).map(item => item.id)).toEqual(['safe']);
});
test('Hàng đợi cũ hỏng được giữ nguyên, không ghi đè bằng rỗng', async () => {
  const storage = require('@react-native-async-storage/async-storage').default;
  const { OUTBOX_KEY } = require('../src/storage/keys');
  await storage.setItem(OUTBOX_KEY, 'bad-json');
  const box =
    require('../src/storage/outbox') as typeof import('../src/storage/outbox');
  await expect(box.hydrate()).rejects.toThrow('Bản cũ vẫn được giữ nguyên');
  expect(await storage.getItem(OUTBOX_KEY)).toBe('bad-json');
});
