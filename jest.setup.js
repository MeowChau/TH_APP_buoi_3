/* eslint-env jest */
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async key => store.get(key) ?? null),
      getAllKeys: jest.fn(async () => [...store.keys()]),
      setItem: jest.fn(async (key, value) => {
        store.set(key, value);
      }),
      clear: jest.fn(async () => {
        store.clear();
      }),
    },
  };
});
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock'),
);
jest.mock('@op-engineering/op-sqlite', () =>
  require('./__tests__/support/sqliteMock.cjs'),
);
jest.mock('@notifee/react-native', () =>
  require('./__tests__/support/notifeeMock.cjs'),
);
