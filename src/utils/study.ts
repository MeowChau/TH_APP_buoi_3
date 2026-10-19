import { courses } from '../data/seed';
import { Assignment, Result } from '../types';
export const getCourse = (id: string) =>
  courses.find(course => course.id === id);
export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
export function mondayOf(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
  return result;
}
export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export const shortDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  });
export const fullDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
export const dayTitle = (date: Date) =>
  ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][
    date.getDay()
  ];
export function deadline(assignment: Assignment, now = new Date()) {
  if (assignment.completed) {
    return { label: 'Đã hoàn thành', tone: 'green' as const };
  }
  const due = new Date(assignment.due);
  if (due.getTime() < now.getTime()) {
    return { label: 'Quá hạn', tone: 'red' as const };
  }
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const dueStart = new Date(due);
  dueStart.setHours(0, 0, 0, 0);
  const days = Math.round((dueStart.getTime() - start.getTime()) / 86400000);
  return {
    label:
      days === 0
        ? 'Hạn hôm nay'
        : days === 1
        ? 'Hạn ngày mai'
        : `Còn ${days} ngày`,
    tone: days <= 1 ? ('yellow' as const) : ('blue' as const),
  };
}
export const resultScore = (result: Result) =>
  Math.round(
    result.parts.reduce(
      (sum, part) => sum + (part.score * part.weight) / 100,
      0,
    ) * 100,
  ) / 100;
export function grade(score: number) {
  if (score >= 8.5) {
    return { letter: 'A', points: 4, label: 'Giỏi' };
  }
  if (score >= 7) {
    return { letter: 'B', points: 3, label: 'Khá' };
  }
  if (score >= 5.5) {
    return { letter: 'C', points: 2, label: 'Trung bình' };
  }
  if (score >= 4) {
    return { letter: 'D', points: 1, label: 'Đạt' };
  }
  return { letter: 'F', points: 0, label: 'Chưa đạt' };
}
export function semesterSummary(results: Result[]) {
  const credits = results.reduce(
    (sum, result) => sum + (getCourse(result.courseId)?.credits ?? 0),
    0,
  );
  const weighted = (points: boolean) =>
    results.reduce(
      (sum, result) =>
        sum +
        (points ? grade(resultScore(result)).points : resultScore(result)) *
          (getCourse(result.courseId)?.credits ?? 0),
      0,
    ) / (credits || 1);
  return {
    credits,
    gpa: weighted(true),
    average: weighted(false),
    passed: results
      .filter(result => resultScore(result) >= 4)
      .reduce(
        (sum, result) => sum + (getCourse(result.courseId)?.credits ?? 0),
        0,
      ),
  };
}
