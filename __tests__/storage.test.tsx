import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  restoreState,
  STORAGE_KEY,
  StudyProvider,
  useStudy,
} from '../src/context/StudyContext';
import { createInitialState } from '../src/data/seed';
let context: ReturnType<typeof useStudy>;
let renderer: ReactTestRenderer.ReactTestRenderer;
function Probe() {
  context = useStudy();
  return null;
}
async function mount() {
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <StudyProvider>
        <Probe />
      </StudyProvider>,
    );
  });
}
beforeEach(async () => {
  jest.restoreAllMocks();
  await AsyncStorage.clear();
  jest.clearAllMocks();
});
afterEach(async () => {
  if (renderer) {
    await act(async () => renderer.unmount());
  }
});
test('profile and completion persist after remount without shifting deadlines', async () => {
  await mount();
  expect(context.loading).toBe(false);
  const due = context.state.assignments[0].due;
  await act(async () => {
    await context.toggleAssignment('a1');
    await context.updateProfile({
      name: 'Trần Hoài An',
      email: 'hoaian@sv.edu.vn',
      phone: '0987654321',
    });
  });
  await act(async () => renderer.unmount());
  await mount();
  expect(context.state.profile.name).toBe('Trần Hoài An');
  expect(context.state.assignments[0]).toMatchObject({ completed: true, due });
});
test('concurrent updates do not overwrite each other', async () => {
  await mount();
  await act(async () => {
    await Promise.all([
      context.toggleAssignment('a1'),
      context.toggleAssignment('a2'),
    ]);
  });
  expect(
    context.state.assignments.slice(0, 2).every(item => item.completed),
  ).toBe(true);
  const saved = restoreState((await AsyncStorage.getItem(STORAGE_KEY))!);
  expect(saved.assignments.slice(0, 2).every(item => item.completed)).toBe(
    true,
  );
});
test('failed writes leave visible state unchanged and a later save recovers', async () => {
  await mount();
  jest
    .spyOn(AsyncStorage, 'setItem')
    .mockRejectedValueOnce(new Error('disk full'));
  await act(async () => {
    await expect(context.toggleAssignment('a1')).rejects.toThrow();
  });
  expect(context.state.assignments[0].completed).toBe(false);
  expect(context.storageError).toBeTruthy();
  await act(async () => {
    await context.toggleAssignment('a1');
  });
  expect(context.state.assignments[0].completed).toBe(true);
  expect(context.storageError).toBeNull();
});
test('failed reads never overwrite saved data with seed data and retry recovers', async () => {
  const stored = createInitialState();
  stored.profile.name = 'Lê Thu Trang';
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  jest
    .spyOn(AsyncStorage, 'getItem')
    .mockRejectedValueOnce(new Error('unavailable'));
  await mount();
  expect(context.storageError).toBeTruthy();
  await act(async () => {
    await expect(context.toggleAssignment('a1')).rejects.toThrow();
  });
  expect(
    JSON.parse((await AsyncStorage.getItem(STORAGE_KEY))!).profile.name,
  ).toBe('Lê Thu Trang');
  await act(async () => {
    context.retry();
  });
  expect(context.state.profile.name).toBe('Lê Thu Trang');
  expect(context.storageError).toBeNull();
});
test('corrupt or unsupported data is rejected', () => {
  expect(() => restoreState('{broken')).toThrow();
  expect(() => restoreState(JSON.stringify({ version: 99 }))).toThrow();
  const invalid = createInitialState();
  invalid.assignments[0].due = 'not a date';
  expect(() => restoreState(JSON.stringify(invalid))).toThrow();
});
