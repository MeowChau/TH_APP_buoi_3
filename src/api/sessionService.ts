import { request } from './client';
import type { Session, Id } from '../types';
export const getAll = () =>
  request<Session[]>('GET', '/sessions?_expand=course');
export const getById = (id: Id) =>
  request<Session>('GET', `/sessions/${encodeURIComponent(id)}?_expand=course`);
