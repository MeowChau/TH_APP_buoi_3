import { calcGpa, toLetter, toScale4 } from '../src/utils/gpa';
import {
  formatDate,
  formatTime,
  isOverdue,
  parseLocalDate,
} from '../src/utils/date';
import {
  normalize,
  validateAssignment,
  validateProfile,
} from '../src/utils/validators';
import type { Course, Grade } from '../src/types';
test.each([
  [8.5, 4, 'A'],
  [8.49, 3.5, 'B+'],
  [8, 3.5, 'B+'],
  [7.99, 3, 'B'],
  [7, 3, 'B'],
  [6.5, 2.5, 'C+'],
  [5.5, 2, 'C'],
  [5, 1.5, 'D+'],
  [4, 1, 'D'],
  [3.99, 0, 'F'],
])('Quy đổi %s đúng điểm cộng', (score, points, letter) => {
  expect(toScale4(Number(score))).toBe(points);
  expect(toLetter(Number(score))).toBe(letter);
});
test('GPA có trọng số, môn F vẫn thuộc mẫu số nhưng không tích lũy', () => {
  const courses = [
    { id: 1, credits: 3 },
    { id: 2, credits: 2 },
  ] as Course[];
  const grades = [
    { courseId: 1, total: 8.2 },
    { courseId: 2, total: 3 },
  ] as Grade[];
  expect(calcGpa(grades, courses)).toEqual({
    gpa: 2.1,
    totalCredits: 3,
    attemptedCredits: 5,
  });
  expect(calcGpa([], []).gpa).toBe(0);
});
test('Ngày địa phương đúng định dạng và từ chối ngày không tồn tại', () => {
  const date = new Date(2026, 10, 9, 14, 32);
  expect(formatDate(date)).toBe('09/11/2026');
  expect(formatTime(date)).toBe('14:32');
  expect(parseLocalDate('31/02/2026')).toBeNull();
  expect(parseLocalDate('29/02/2028')).not.toBeNull();
  expect(new Date(parseLocalDate('09/11/2026')!).getHours()).toBe(23);
  expect(isOverdue('2020-01-01', 'done')).toBe(false);
});
test('Tìm kiếm tiếng Việt không dấu', () => {
  expect(normalize('Cơ sở dữ liệu')).toBe('co so du lieu');
  expect(normalize('ĐI ĐỘNG')).toBe('di dong');
});
test('Kiểm tra form bài tập và hồ sơ', () => {
  expect(
    validateAssignment(
      { title: ' ', courseId: '', description: '', dueDate: '2020-01-01' },
      new Date('2026-11-02'),
    ),
  ).toHaveProperty('title');
  expect(
    validateAssignment(
      {
        title: 'Bài mới',
        courseId: 1,
        description: '',
        dueDate: '2026-11-09T23:59:00Z',
      },
      new Date('2026-11-02'),
    ),
  ).toEqual({});
  expect(
    validateProfile({
      fullName: 'Nguyễn Minh Anh',
      email: 'anh@sv.edu.vn',
      phone: '0912345678',
    }),
  ).toEqual({});
  expect(
    validateProfile({ fullName: '', email: 'sai', phone: '12' }),
  ).toHaveProperty('email');
});
