import type { AssignmentInput, ProfileInput } from '../types';
export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim();
export function validateProfile(input: ProfileInput) {
  const errors: Partial<Record<keyof ProfileInput, string>> = {};
  if (input.fullName.trim().length < 2) {
    errors.fullName = 'Họ tên phải có ít nhất 2 ký tự.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'Email chưa đúng định dạng.';
  }
  if (!/^(0\d{9}|\+84\d{9})$/.test(input.phone.trim())) {
    errors.phone = 'Nhập số điện thoại Việt Nam hợp lệ.';
  }
  return errors;
}
export function validateAssignment(input: AssignmentInput, now = new Date()) {
  const errors: Partial<Record<keyof AssignmentInput, string>> = {};
  if (!input.title.trim()) {
    errors.title = 'Vui lòng nhập tiêu đề bài tập.';
  }
  if (!input.courseId) {
    errors.courseId = 'Vui lòng chọn môn học.';
  }
  const due = new Date(input.dueDate).getTime();
  if (!Number.isFinite(due) || due <= now.getTime()) {
    errors.dueDate = 'Hạn nộp phải hợp lệ và không ở quá khứ.';
  }
  return errors;
}
