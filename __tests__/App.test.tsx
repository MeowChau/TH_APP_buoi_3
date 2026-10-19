/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('opens overview with five tabs and student data', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const tree = JSON.stringify(renderer!.toJSON());
  expect(tree).toContain('Việc học hôm nay.');
  expect(tree).toContain('2351120042');
  ['Tổng quan', 'Môn học', 'Lịch học', 'Bài tập', 'Cá nhân'].forEach(label =>
    expect(tree).toContain(label),
  );
  await ReactTestRenderer.act(async () => renderer!.unmount());
});
