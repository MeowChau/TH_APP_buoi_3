import { request } from './client';
import type { Course, Id } from '../types';
export const getAll = () => request<Course[]>('GET', '/courses');
export const getById = (id: Id) =>
  request<Course>('GET', `/courses/${encodeURIComponent(id)}`);
