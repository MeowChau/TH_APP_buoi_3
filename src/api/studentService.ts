import { request } from './client';
import type { Student, Id } from '../types';
export const getAll = () => request<Student[]>('GET', '/students');
export const getById = (id: Id) =>
  request<Student>('GET', `/students/${encodeURIComponent(id)}`);
export const update = (id: Id, data: Partial<Student>) =>
  request<Student>('PATCH', `/students/${encodeURIComponent(id)}`, data);
