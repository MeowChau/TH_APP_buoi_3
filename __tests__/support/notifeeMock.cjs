/* eslint-env jest */
const pending = new Map();
const settings = () => ({ authorizationStatus: 1, android: { alarm: 1 } });
const api = {
  getNotificationSettings: jest.fn(async () => settings()),
  requestPermission: jest.fn(async () => settings()),
  createChannel: jest.fn(async value => value.id),
  getChannel: jest.fn(async () => ({ blocked: false })),
  getTriggerNotifications: jest.fn(async () => [...pending.values()]),
  createTriggerNotification: jest.fn(async (notification, trigger) => {
    pending.set(notification.id, { notification, trigger });
    return notification.id;
  }),
  cancelNotification: jest.fn(async id => {
    pending.delete(id);
  }),
  displayNotification: jest.fn(async value => value.id),
  openNotificationSettings: jest.fn(async () => {}),
  openAlarmPermissionSettings: jest.fn(async () => {}),
  onBackgroundEvent: jest.fn(),
};
module.exports = {
  __esModule: true,
  default: api,
  AlarmType: { SET_AND_ALLOW_WHILE_IDLE: 1, SET_EXACT_AND_ALLOW_WHILE_IDLE: 3 },
  AndroidImportance: { HIGH: 4 },
  AndroidNotificationSetting: { ENABLED: 1, DISABLED: 0 },
  AuthorizationStatus: { DENIED: 0, AUTHORIZED: 1, PROVISIONAL: 2 },
  TriggerType: { TIMESTAMP: 0 },
  reset: () => {
    pending.clear();
    api.getNotificationSettings.mockImplementation(async () => settings());
    api.getChannel.mockImplementation(async () => ({ blocked: false }));
  },
};
