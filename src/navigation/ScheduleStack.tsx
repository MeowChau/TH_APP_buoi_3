import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes, StackParamList } from './routes';
import { stackOptions } from './options';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
const Stack = createNativeStackNavigator<StackParamList>();
export default function ScheduleStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen
        name={routes.Schedule}
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routes.SessionDetail}
        component={SessionDetailScreen}
        options={{ title: 'Chi tiết buổi học' }}
      />
    </Stack.Navigator>
  );
}
