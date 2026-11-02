import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TextInput } from 'react-native';
import App from '../App';
import CourseListScreen from '../src/screens/courses/CourseListScreen';
import AppDataProvider from '../src/context/AppDataContext';
import SyncProvider from '../src/context/SyncContext';
import { routes } from '../src/navigation/routes';
const db = require('../db.json');
let activeTree: renderer.ReactTestRenderer | undefined;
function textOf(tree: renderer.ReactTestRenderer) {
  return tree.root
    .findAll(node => typeof node.type === 'string')
    .flatMap(node => node.children.filter(child => typeof child === 'string'))
    .join(' ');
}
afterEach(async () => {
  if (activeTree) {
    await act(async () => {
      activeTree!.unmount();
    });
    activeTree = undefined;
  }
});
beforeEach(() => {
  globalThis.fetch = jest.fn(async url => {
    const [resource, id] = String(url)
      .replace(/^https?:\/\/[^/]+\//, '')
      .split('?')[0]
      .split('/');
    const expand = (entity: any) =>
      entity.courseId
        ? {
            ...entity,
            course: db.courses.find(
              (course: any) => course.id === entity.courseId,
            ),
          }
        : entity;
    const data = id
      ? db[resource].find((item: any) => String(item.id) === id)
      : db[resource].map(expand);
    return { ok: true, status: 200, json: async () => data } as Response;
  });
});
test('Ứng dụng render hồ sơ, năm tab và dữ liệu từ API', async () => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<App />);
    activeTree = tree;
  });
  const output = textOf(tree);
  for (const label of [
    'Nguyễn Minh Anh',
    '2351120042',
    'Tổng quan',
    'Môn học',
    'Lịch học',
    'Bài tập',
    'Cá nhân',
  ]) {
    expect(output).toContain(label);
  }
  expect(globalThis.fetch).toHaveBeenCalled();
  await act(async () => {
    tree.unmount();
  });
});
test('Tìm môn không tồn tại hiện rỗng; nhấn card chỉ truyền id', async () => {
  const navigate = jest.fn();
  let tree!: renderer.ReactTestRenderer;
  const props = {
    navigation: { navigate },
    route: { key: 'courses', name: routes.CourseList },
  } as any;
  await act(async () => {
    tree = renderer.create(
      <SyncProvider>
        <AppDataProvider>
          <CourseListScreen {...props} />
        </AppDataProvider>
      </SyncProvider>,
    );
  });
  activeTree = tree;
  const input = tree.root.findByType(TextInput);
  await act(async () => {
    input.props.onChangeText('mon-khong-ton-tai');
  });
  expect(textOf(tree)).toContain('Không tìm thấy môn học');
  await act(async () => {
    input.props.onChangeText('co so du lieu');
  });
  const button = tree.root.findAllByProps({
    accessibilityLabel: 'Cơ sở dữ liệu, 3 tín chỉ. Xem chi tiết',
  })[0];
  expect(button).toBeDefined();
  await act(async () => {
    button.props.onPress();
  });
  expect(navigate).toHaveBeenCalledWith(routes.CourseDetail, { id: 2 });
  await act(async () => {
    tree.unmount();
  });
});
