import {
  courses,
  createInitialState,
  results,
  sessions,
} from '../src/data/seed';
import {
  addDays,
  deadline,
  grade,
  mondayOf,
  normalize,
  resultScore,
  semesterSummary,
} from '../src/utils/study';
import { validateProfile } from '../src/utils/validation';
test('all records reference real courses and assessment weights total 100%', () => {
  const ids = courses.map(course => course.id);
  [...sessions, ...results, ...createInitialState().assignments].forEach(
    record => expect(ids).toContain(record.courseId),
  );
  results.forEach(result =>
    expect(result.parts.reduce((sum, part) => sum + part.weight, 0)).toBe(100),
  );
});
test('Vietnamese searches work with or without diacritics', () => {
  expect(normalize('  Cấu trúc DỮ LIỆU và Giải thuật  ')).toBe(
    'cau truc du lieu va giai thuat',
  );
  expect(normalize('Ứng dụng di động')).toContain(normalize('di dong'));
});
test('deadline distinguishes overdue, today, tomorrow, and completed', () => {
  const now = new Date(2026, 9, 19, 10);
  const assignment = createInitialState(now).assignments[0];
  expect(deadline(assignment, now).label).toBe('Hạn ngày mai');
  expect(
    deadline(
      { ...assignment, due: new Date(2026, 9, 19, 23, 59).toISOString() },
      now,
    ).label,
  ).toBe('Hạn hôm nay');
  expect(
    deadline(
      { ...assignment, due: new Date(2026, 9, 18, 23, 59).toISOString() },
      now,
    ).label,
  ).toBe('Quá hạn');
  expect(
    deadline({ ...assignment, completed: true }, addDays(now, 10)).label,
  ).toBe('Đã hoàn thành');
});
test('week navigation handles Sundays and year boundaries', () => {
  const monday = mondayOf(new Date(2027, 0, 3, 18));
  expect([monday.getFullYear(), monday.getMonth(), monday.getDate()]).toEqual([
    2026, 11, 28,
  ]);
  expect(addDays(monday, 7).getDate()).toBe(4);
  expect(monday.getHours()).toBe(0);
});
test('weighted scores and credit-weighted GPA agree with sample data', () => {
  expect(resultScore(results[0])).toBe(8.95);
  const summary = semesterSummary(results);
  expect(summary.credits).toBe(15);
  expect(summary.passed).toBe(15);
  expect(summary.gpa).toBeCloseTo(3.4);
  expect(summary.average).toBeCloseTo(
    (8.95 * 3 + 8.4 * 3 + 8.2 * 4 + 9.1 * 3 + 7.8 * 2) / 15,
  );
  expect(semesterSummary([])).toEqual({
    credits: 0,
    passed: 0,
    gpa: 0,
    average: 0,
  });
});
test.each([
  [8.5, 'A', 4],
  [7, 'B', 3],
  [5.5, 'C', 2],
  [4, 'D', 1],
  [3.99, 'F', 0],
])('grade boundary %s', (score, letter, points) => {
  expect(grade(Number(score))).toMatchObject({ letter, points });
});
test('profile validation accepts Vietnamese phone formats and rejects bad fields', () => {
  expect(
    validateProfile({
      name: 'Nguyễn Minh Anh',
      email: 'minhanh@sv.edu.vn',
      phone: '0912 345 678',
    }),
  ).toEqual({});
  expect(
    validateProfile({
      name: 'Trần An',
      email: 'an@sv.edu.vn',
      phone: '+84912345678',
    }),
  ).toEqual({});
  expect(
    Object.keys(validateProfile({ name: ' ', email: 'broken@', phone: '123' })),
  ).toEqual(['name', 'email', 'phone']);
});
