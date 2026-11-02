import notifee, {
  AlarmType,
  AndroidNotificationSetting,
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import {
  buildReminderPlan,
  MAX_REMINDERS,
  REMINDER_LEAD_MS,
  REMINDER_PREFIX,
} from '../src/utils/reminders';
import {
  getReminderCapabilities,
  reconcileReminders,
  requestReminderPermission,
  sendTestReminder,
} from '../src/notifications/reminders';
import type { Assignment } from '../src/types';
const osDescriptor = Object.getOwnPropertyDescriptor(Platform, 'OS')!;
const versionDescriptor = Object.getOwnPropertyDescriptor(Platform, 'Version')!;
const assignment = (id = 1, days = 3): Assignment => ({
  id,
  courseId: 1,
  title: `Bài tập ${id}`,
  description: '',
  dueDate: new Date(Date.now() + days * REMINDER_LEAD_MS).toISOString(),
  status: 'todo',
  updatedAt: new Date().toISOString(),
});
beforeEach(() => {
  jest.clearAllMocks();
  require('./support/notifeeMock.cjs').reset();
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    value: 'android',
  });
  Object.defineProperty(Platform, 'Version', { configurable: true, value: 33 });
});
afterEach(() => {
  Object.defineProperty(Platform, 'OS', osDescriptor);
  Object.defineProperty(Platform, 'Version', versionDescriptor);
});
test('Lịch nhắc đúng trước 24 giờ, bỏ bài xong, hạn gần hơn 24 giờ và ngày không hợp lệ', () => {
  const todo = assignment();
  const plan = buildReminderPlan([
    todo,
    { ...assignment(2), status: 'done' },
    assignment(3, 0.5),
    { ...assignment(4), dueDate: 'invalid' },
  ]);
  expect(plan).toHaveLength(1);
  expect(plan[0].timestamp).toBe(Date.parse(todo.dueDate) - REMINDER_LEAD_MS);
});
test('Giới hạn 45 lịch gần nhất và giữ thứ tự theo hạn', () => {
  const values = Array.from({ length: 60 }, (_, index) =>
    assignment(index + 1, 62 - index),
  );
  const plan = buildReminderPlan(values);
  expect(plan).toHaveLength(MAX_REMINDERS);
  expect(plan[0].assignment.id).toBe(60);
});
test('Không tạo trùng khi mở lại hoặc refresh cùng dữ liệu', async () => {
  const values = [assignment()];
  await reconcileReminders(values, true);
  await reconcileReminders(values, true);
  expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(1);
  expect(
    jest.mocked(notifee.createTriggerNotification).mock.calls[0][1],
  ).toMatchObject({
    type: TriggerType.TIMESTAMP,
    timestamp: Date.parse(values[0].dueDate) - REMINDER_LEAD_MS,
    alarmManager: { type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE },
  });
});
test('Đánh dấu xong hủy lịch của bài đó, không xóa thông báo khác', async () => {
  const value = assignment();
  await reconcileReminders([value], true);
  await notifee.createTriggerNotification(
    { id: 'another-feature', title: 'Thông báo khác' },
    { type: TriggerType.TIMESTAMP, timestamp: Date.now() + 100000 },
  );
  await reconcileReminders([{ ...value, status: 'done' }], true);
  expect(notifee.cancelNotification).toHaveBeenCalledWith(
    `${REMINDER_PREFIX}1`,
  );
  expect(
    (await notifee.getTriggerNotifications()).map(item => item.notification.id),
  ).toEqual(['another-feature']);
});
test('Đổi hạn cập nhật cùng mã lịch và timestamp mới', async () => {
  const first = assignment();
  const next = {
    ...first,
    dueDate: new Date(
      Date.parse(first.dueDate) + REMINDER_LEAD_MS,
    ).toISOString(),
  };
  await reconcileReminders([first], true);
  await reconcileReminders([next], true);
  const calls = jest.mocked(notifee.createTriggerNotification).mock.calls;
  expect(calls[0][0].id).toBe(calls[1][0].id);
  expect(calls[1][1]).toMatchObject({
    timestamp: Date.parse(next.dueDate) - REMINDER_LEAD_MS,
  });
});
test('Không có quyền thông báo: không đặt lịch, hủy lịch đã có', async () => {
  const values = [assignment()];
  await reconcileReminders(values, true);
  jest
    .mocked(notifee.getNotificationSettings)
    .mockResolvedValue({
      authorizationStatus: AuthorizationStatus.DENIED,
      android: { alarm: AndroidNotificationSetting.ENABLED },
    } as any);
  expect(await reconcileReminders(values, true)).toMatchObject({
    authorized: false,
    scheduledCount: 0,
  });
  expect(await notifee.getTriggerNotifications()).toEqual([]);
});
test('Android 12+ thiếu quyền exact alarm dùng lịch inexact an toàn', async () => {
  jest
    .mocked(notifee.getNotificationSettings)
    .mockResolvedValue({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
      android: { alarm: AndroidNotificationSetting.DISABLED },
    } as any);
  expect(await reconcileReminders([assignment()], true)).toMatchObject({
    exactAllowed: false,
    scheduledCount: 1,
  });
  expect(
    jest.mocked(notifee.createTriggerNotification).mock.calls[0][1],
  ).toMatchObject({
    alarmManager: { type: AlarmType.SET_AND_ALLOW_WHILE_IDLE },
  });
});
test('Cấp quyền exact sau đó sẽ cập nhật lịch sang chính xác', async () => {
  const values = [assignment()];
  jest
    .mocked(notifee.getNotificationSettings)
    .mockResolvedValue({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
      android: { alarm: AndroidNotificationSetting.DISABLED },
    } as any);
  await reconcileReminders(values, true);
  jest
    .mocked(notifee.getNotificationSettings)
    .mockResolvedValue({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
      android: { alarm: AndroidNotificationSetting.ENABLED },
    } as any);
  await reconcileReminders(values, true);
  expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(2);
});
test('Tắt nhắc hạn hủy toàn bộ lịch bài tập', async () => {
  const values = [assignment(1), assignment(2)];
  await reconcileReminders(values, true);
  await reconcileReminders(values, false);
  expect(await notifee.getTriggerNotifications()).toEqual([]);
});
test('Lỗi native không chặn lần đặt lịch tiếp theo', async () => {
  jest
    .mocked(notifee.createTriggerNotification)
    .mockRejectedValueOnce(new Error('Native failure'));
  await expect(reconcileReminders([assignment()], true)).rejects.toThrow(
    'Native failure',
  );
  expect(await reconcileReminders([assignment()], true)).toMatchObject({
    scheduledCount: 1,
  });
});
test('Quyền channel bị tắt cũng được nhận diện', async () => {
  jest
    .mocked(notifee.getChannel)
    .mockResolvedValue({
      id: 'study-deadlines',
      name: 'Hạn nộp',
      blocked: true,
    } as any);
  expect(await getReminderCapabilities()).toMatchObject({ authorized: false });
});
test('Chỉ hỏi quyền khi gọi hành động bật, và có thông báo thử', async () => {
  await reconcileReminders([], false);
  expect(notifee.requestPermission).not.toHaveBeenCalled();
  await requestReminderPermission();
  expect(notifee.requestPermission).toHaveBeenCalledTimes(1);
  await sendTestReminder();
  expect(notifee.displayNotification).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'study-reminder-test' }),
  );
});
