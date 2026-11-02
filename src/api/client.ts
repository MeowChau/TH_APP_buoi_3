import { BASE_URL, TIMEOUT } from '../config';
import type { ApiError } from '../types';
export async function request<T>(
  method: string,
  url: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT);
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      throw {
        type: 'http',
        status: response.status,
        message:
          response.status === 404
            ? 'Không tìm thấy dữ liệu trên máy chủ.'
            : `Máy chủ từ chối yêu cầu (HTTP ${response.status}). Vui lòng thử lại.`,
      } satisfies ApiError;
    }
    if (response.status === 204) {
      return undefined as T;
    }
    try {
      return (await response.json()) as T;
    } catch {
      throw {
        type: 'http',
        status: response.status,
        message: 'Dữ liệu máy chủ không đúng định dạng JSON.',
      } satisfies ApiError;
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }
    throw {
      type: timedOut ? 'timeout' : 'network',
      status: 0,
      message: timedOut
        ? 'Máy chủ chưa phản hồi sau 10 giây. Vui lòng thử lại.'
        : 'Không kết nối được API. Kiểm tra json-server và địa chỉ trong src/config.ts.',
    } satisfies ApiError;
  } finally {
    clearTimeout(timer);
  }
}
