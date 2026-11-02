import { request } from '../src/api/client';
import { TIMEOUT } from '../src/config';
const fetchMock = jest.fn();
beforeEach(() => {
  globalThis.fetch = fetchMock;
  fetchMock.mockReset();
});
afterEach(() => {
  jest.useRealTimers();
});
test('GET trả JSON và không gắn body', async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [{ id: 1 }],
  });
  await expect(request('GET', '/courses')).resolves.toEqual([{ id: 1 }]);
  expect(fetchMock.mock.calls[0][1].body).toBeUndefined();
});
test('POST gửi JSON và Content-Type', async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 201,
    json: async () => ({ id: 'client-id' }),
  });
  await request('POST', '/assignments', { title: 'Ôn tập' });
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
    title: 'Ôn tập',
  });
});
test('HTTP lỗi được chuẩn hóa', async () => {
  fetchMock.mockResolvedValue({ ok: false, status: 404 });
  await expect(request('GET', '/courses/404')).rejects.toMatchObject({
    type: 'http',
    status: 404,
  });
});
test('Mất mạng được chuẩn hóa', async () => {
  fetchMock.mockRejectedValue(new TypeError('Network request failed'));
  await expect(request('GET', '/courses')).rejects.toMatchObject({
    type: 'network',
    status: 0,
  });
});
test('Timeout sau đúng 10 giây', async () => {
  jest.useFakeTimers();
  fetchMock.mockImplementation(
    (_url, options) =>
      new Promise((_resolve, reject) =>
        options.signal.addEventListener('abort', () =>
          reject(new Error('aborted')),
        ),
      ),
  );
  const operation = request('GET', '/courses').catch(error => error);
  await jest.advanceTimersByTimeAsync(TIMEOUT);
  expect(await operation).toMatchObject({
    type: 'timeout',
    status: 0,
  });
});
test('JSON hỏng không làm văng ứng dụng', async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError();
    },
  });
  await expect(request('GET', '/courses')).rejects.toMatchObject({
    type: 'http',
    status: 200,
  });
});
