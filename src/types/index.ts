export type Id = number | string;
export type Student = {
  id: Id;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
};
export type Course = {
  id: Id;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
};
export type Session = {
  id: Id;
  courseId: Id;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
  course?: Course;
};
export type Assignment = {
  id: Id;
  courseId: Id;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'done';
  updatedAt: string;
  course?: Course;
};
export type Grade = {
  id: Id;
  courseId: Id;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: Course;
};
export type ApiError = {
  type: 'network' | 'timeout' | 'http';
  status: number;
  message: string;
};
export type OutboxAction = {
  id: string;
  method: 'POST' | 'PATCH';
  url: string;
  body: Record<string, unknown>;
  createdAt: string;
};
export type CacheEntry<T> = { data: T; savedAt: string };
export type ProfileInput = Pick<Student, 'fullName' | 'email' | 'phone'>;
export type AssignmentInput = Pick<
  Assignment,
  'courseId' | 'title' | 'description' | 'dueDate'
>;
