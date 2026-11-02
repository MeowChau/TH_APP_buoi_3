import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes, StackParamList } from './routes';
import { stackOptions } from './options';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
const Stack = createNativeStackNavigator<StackParamList>();
export default function CourseStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen
        name={routes.CourseList}
        component={CourseListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routes.CourseDetail}
        component={CourseDetailScreen}
        options={{ title: 'Chi tiết môn học' }}
      />
      <Stack.Screen
        name={routes.SessionDetail}
        component={SessionDetailScreen}
        options={{ title: 'Chi tiết buổi học' }}
      />
      <Stack.Screen
        name={routes.AssignmentDetail}
        component={AssignmentDetailScreen}
        options={{ title: 'Chi tiết bài tập' }}
      />
    </Stack.Navigator>
  );
}
