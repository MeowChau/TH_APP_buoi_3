import notifee, {
  AlarmType,
  AndroidImportance,
  AndroidNotificationSetting,
  AuthorizationStatus,
  TriggerType,
  type TimestampTrigger,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import type { Assignment } from '../types';
import { buildReminderPlan, REMINDER_PREFIX } from '../utils/reminders';
import { formatDate, formatTime } from '../utils/date';
import colors from '../theme/colors';
const CHANNEL_ID = 'study-deadlines';
let sequence: Promise<unknown> = Promise.resolve();
async function channel() {
  return notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Hạn nộp bài tập',
    description: 'Nhắc bài tập trước hạn nộp 24 giờ',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}
export async function getReminderCapabilities() {
  const settings = await notifee.getNotificationSettings();
  const existing =
    Platform.OS === 'android'
      ? await notifee.getChannel(CHANNEL_ID)
      : undefined;
  return {
    authorized:
      settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED &&
      !existing?.blocked,
    exactAllowed:
      Platform.OS !== 'android' ||
      Number(Platform.Version) < 31 ||
      settings.android.alarm === AndroidNotificationSetting.ENABLED,
  };
}
export async function requestReminderPermission() {
  await notifee.requestPermission({ alert: true, sound: true, badge: true });
  await channel();
  return getReminderCapabilities();
}
export const openNotificationSettings = () =>
  notifee.openNotificationSettings();
export const openAlarmSettings = () => notifee.openAlarmPermissionSettings();
export function reconcileReminders(
  assignments: Assignment[],
  enabled: boolean,
) {
  const task = sequence
    .catch(() => {})
    .then(async () => {
      const capabilities = await getReminderCapabilities();
      const pending = await notifee.getTriggerNotifications();
      const own = pending.filter(item =>
        item.notification.id?.startsWith(REMINDER_PREFIX),
      );
      const plan =
        enabled && capabilities.authorized
          ? buildReminderPlan(assignments)
          : [];
      const desired = new Set(plan.map(item => item.id));
      for (const item of own) {
        if (!desired.has(item.notification.id!)) {
          await notifee.cancelNotification(item.notification.id!);
        }
      }
      if (plan.length) {
        await channel();
      }
      for (const item of plan) {
        const previous = own.find(entry => entry.notification.id === item.id);
        const mode = capabilities.exactAllowed ? 'exact' : 'inexact';
        if (
          previous?.notification.data?.signature === item.signature &&
          previous.notification.data.mode === mode
        ) {
          continue;
        }
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: item.timestamp,
          ...(Platform.OS === 'android'
            ? {
                alarmManager: {
                  type: capabilities.exactAllowed
                    ? AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE
                    : AlarmType.SET_AND_ALLOW_WHILE_IDLE,
                },
              }
            : {}),
        };
        const assignment = item.assignment;
        await notifee.createTriggerNotification(
          {
            id: item.id,
            title: 'Còn 24 giờ để nộp bài',
            body: `${assignment.title}${
              assignment.course?.name ? ` · ${assignment.course.name}` : ''
            }\nHạn nộp: ${formatTime(assignment.dueDate)}, ${formatDate(
              assignment.dueDate,
            )}`,
            data: {
              assignmentId: String(assignment.id),
              signature: item.signature,
              mode,
            },
            android: {
              channelId: CHANNEL_ID,
              smallIcon: 'ic_stat_book',
              color: colors.green,
              pressAction: { id: 'default' },
            },
            ios: {
              sound: 'default',
              foregroundPresentationOptions: {
                alert: true,
                sound: true,
                badge: false,
                banner: true,
                list: true,
              },
            },
          },
          trigger,
        );
      }
      return { ...capabilities, scheduledCount: plan.length };
    });
  sequence = task;
  return task;
}
export async function sendTestReminder() {
  const capabilities = await getReminderCapabilities();
  if (!capabilities.authorized) {
    throw new Error(
      'Thông báo đang bị tắt. Hãy cho phép thông báo trong cài đặt ứng dụng.',
    );
  }
  await channel();
  await notifee.displayNotification({
    id: 'study-reminder-test',
    title: 'Nhắc hạn đã sẵn sàng',
    body: 'Ứng dụng sẽ nhắc các bài chưa hoàn thành trước hạn nộp 24 giờ.',
    android: {
      channelId: CHANNEL_ID,
      smallIcon: 'ic_stat_book',
      color: colors.green,
      pressAction: { id: 'default' },
    },
    ios: { sound: 'default' },
  });
}
