import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes, StackParamList } from './routes';
import { stackOptions } from './options';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import GradeListScreen from '../screens/profile/GradeListScreen';
import GradeDetailScreen from '../screens/profile/GradeDetailScreen';
const Stack = createNativeStackNavigator<StackParamList>();
export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen
        name={routes.Profile}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routes.EditProfile}
        component={EditProfileScreen}
        options={{ title: 'Chỉnh sửa hồ sơ' }}
      />
      <Stack.Screen
        name={routes.GradeList}
        component={GradeListScreen}
        options={{ title: 'Điểm theo học kỳ' }}
      />
      <Stack.Screen
        name={routes.GradeDetail}
        component={GradeDetailScreen}
        options={{ title: 'Kết quả học tập' }}
      />
    </Stack.Navigator>
  );
}
