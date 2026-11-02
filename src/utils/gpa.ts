import type { Course, Grade } from '../types';
export function toScale4(score: number) {
  if (score >= 8.5) {
    return 4;
  }
  if (score >= 8) {
    return 3.5;
  }
  if (score >= 7) {
    return 3;
  }
  if (score >= 6.5) {
    return 2.5;
  }
  if (score >= 5.5) {
    return 2;
  }
  if (score >= 5) {
    return 1.5;
  }
  if (score >= 4) {
    return 1;
  }
  return 0;
}
export function toLetter(score: number) {
  return (
    {
      4: 'A',
      3.5: 'B+',
      3: 'B',
      2.5: 'C+',
      2: 'C',
      1.5: 'D+',
      1: 'D',
      0: 'F',
    } as Record<number, string>
  )[toScale4(score)];
}
export function calcGpa(grades: Grade[], courses: Course[]) {
  let credits = 0;
  let passed = 0;
  let weighted = 0;
  for (const grade of grades) {
    const course =
      courses.find(item => String(item.id) === String(grade.courseId)) ??
      grade.course;
    const count = course?.credits ?? 0;
    credits += count;
    weighted += toScale4(grade.total) * count;
    if (grade.total >= 4) {
      passed += count;
    }
  }
  return {
    gpa: credits ? weighted / credits : 0,
    totalCredits: passed,
    attemptedCredits: credits,
  };
}
