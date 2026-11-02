import { request } from './client';
import type { Grade, Id } from '../types';
export const getAll = () => request<Grade[]>('GET', '/grades?_expand=course');
export const getById = (id: Id) =>
  request<Grade>('GET', `/grades/${encodeURIComponent(id)}?_expand=course`);
