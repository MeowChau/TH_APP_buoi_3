import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes, StackParamList } from './routes';
import { stackOptions } from './options';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentFormScreen from '../screens/assignments/AssignmentFormScreen';
const Stack = createNativeStackNavigator<StackParamList>();
export default function AssignmentStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen
        name={routes.AssignmentList}
        component={AssignmentListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routes.AssignmentDetail}
        component={AssignmentDetailScreen}
        options={{ title: 'Chi tiết bài tập' }}
      />
      <Stack.Screen
        name={routes.AssignmentForm}
        component={AssignmentFormScreen}
        options={{ title: 'Thêm bài tập' }}
      />
    </Stack.Navigator>
  );
}
