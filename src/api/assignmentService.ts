import { request } from './client';
import type { Assignment, Id } from '../types';
export const getAll = () =>
  request<Assignment[]>(
    'GET',
    '/assignments?_expand=course&_sort=dueDate&_order=asc',
  );
export const getById = (id: Id) =>
  request<Assignment>(
    'GET',
    `/assignments/${encodeURIComponent(id)}?_expand=course`,
  );
export const update = (id: Id, data: Partial<Assignment>) =>
  request<Assignment>('PATCH', `/assignments/${encodeURIComponent(id)}`, data);
export const create = (data: Partial<Assignment>) =>
  request<Assignment>('POST', '/assignments', data);
