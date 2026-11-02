import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BookOpen,
  CalendarBlank,
  CheckSquare,
  House,
  UserCircle,
} from '../components/Icons';
import { routes, TabParamList } from './routes';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
const icons = {
  [routes.HomeTab]: House,
  [routes.CourseTab]: BookOpen,
  [routes.ScheduleTab]: CalendarBlank,
  [routes.AssignmentTab]: CheckSquare,
  [routes.ProfileTab]: UserCircle,
};
/** @param name - Tab bắt buộc. @param focused - Đang chọn, bắt buộc. @param color - Màu biểu tượng, bắt buộc. */
export default function TabIcon({
  name,
  focused,
  color,
}: {
  name: keyof TabParamList;
  focused: boolean;
  color: string;
}) {
  const Icon = icons[name];
  return (
    <View style={[styles.icon, focused && styles.active]}>
      <Icon
        size={spacing.icon}
        color={color}
        weight={focused ? 'fill' : 'bold'}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: spacing.tabIconWidth,
    height: spacing.tabIconHeight,
    borderRadius: spacing.radiusSmall,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.greenSoft },
});
