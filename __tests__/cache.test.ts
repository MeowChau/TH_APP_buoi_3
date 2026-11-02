import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCache, setCache } from '../src/storage/cache';
import { getQuery, runQuery, replaceQuery } from '../src/hooks/queryStore';
beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});
test('Cache kèm timestamp, cache trước trong khi mạng còn chờ', async () => {
  await setCache('cache-first-test', [{ id: 1 }], '2026-10-26T08:00:00Z');
  let resolve!: (value: { id: number }[]) => void;
  const fetcher = jest.fn(
    () =>
      new Promise<{ id: number }[]>(done => {
        resolve = done;
      }),
  );
  const task = runQuery('cache-first-test', fetcher, true);
  for (let i = 0; i < 20 && !fetcher.mock.calls.length; i++) {
    await Promise.resolve();
  }
  expect(getQuery('cache-first-test').state.data).toEqual([{ id: 1 }]);
  resolve([{ id: 2 }]);
  await task;
  expect((await getCache('cache-first-test'))?.data).toEqual([{ id: 2 }]);
});
test('Server tắt lần đầu: lỗi + kết thúc loading, thử lại lấy được dữ liệu', async () => {
  await runQuery(
    'first-off',
    async () => {
      throw { message: 'Server tắt' };
    },
    true,
  );
  expect(getQuery('first-off').state).toMatchObject({
    data: null,
    loading: false,
    error: 'Server tắt',
  });
  await runQuery('first-off', async () => [1], true, true);
  expect(getQuery('first-off').state).toMatchObject({
    data: [1],
    error: null,
    refreshing: false,
  });
});
test('Offline dùng cache và tuyệt đối không gọi mạng', async () => {
  await setCache('offline-restart', [1, 2]);
  const fetcher = jest.fn();
  await runQuery('offline-restart', fetcher, false);
  expect(fetcher).not.toHaveBeenCalled();
  expect(getQuery('offline-restart').state.data).toEqual([1, 2]);
});
test('Làm mới lỗi không làm mất cache', async () => {
  await replaceQuery('refresh-failure', () => [1]);
  await runQuery(
    'refresh-failure',
    async () => {
      throw new Error('Lỗi mạng');
    },
    true,
    true,
  );
  expect(getQuery('refresh-failure').state).toMatchObject({
    data: [1],
    error: 'Lỗi mạng',
    refreshing: false,
  });
});
test('GET cũ trả chậm không ghi đè cập nhật vừa đồng bộ', async () => {
  let resolve!: (value: number[]) => void;
  const fetcher = jest.fn(
    () =>
      new Promise<number[]>(done => {
        resolve = done;
      }),
  );
  const pending = runQuery('race-test', fetcher, true);
  for (let i = 0; i < 20 && !fetcher.mock.calls.length; i++) {
    await Promise.resolve();
  }
  await replaceQuery('race-test', () => [2]);
  resolve([1]);
  await pending;
  expect(getQuery('race-test').state.data).toEqual([2]);
  expect((await getCache('race-test'))?.data).toEqual([2]);
});
