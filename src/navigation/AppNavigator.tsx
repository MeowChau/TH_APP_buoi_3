import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { X } from '../components/Icons';
import TabIcon from './TabIcon';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { routes, TabParamList } from './routes';
import { useAppData } from '../context/AppDataContext';
import { useSync } from '../context/SyncContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';
import layout from '../theme/layout';
const Tab = createBottomTabNavigator<TabParamList>();
const tabIcons = Object.fromEntries(
  Object.values(routes).map(name => [
    name,
    ({ focused, color }: { focused: boolean; color: string }) => (
      <TabIcon
        name={name as keyof TabParamList}
        focused={focused}
        color={color}
      />
    ),
  ]),
);
export default function AppNavigator() {
  const insets = useSafeAreaInsets();
  const { assignments } = useAppData();
  const sync = useSync();
  const count = assignments.filter(item => item.status === 'todo').length;
  return (
    <View style={styles.page}>
      {sync.message ? (
        <SafeAreaView edges={['top']} style={styles.notice}>
          <Text accessibilityRole="alert" style={styles.noticeText}>
            {sync.message}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng thông báo đồng bộ"
            onPress={sync.dismissMessage}
            style={styles.dismiss}
          >
            <X size={spacing.icon} color={colors.text} />
          </Pressable>
        </SafeAreaView>
      ) : null}
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            primary: colors.text,
            border: colors.border,
          },
        }}
      >
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarHideOnKeyboard: true,
            tabBarStyle: [
              styles.bar,
              {
                height:
                  spacing.tabHeight +
                  Math.max(insets.bottom, spacing.tabBottom),
                paddingBottom: Math.max(insets.bottom, spacing.tabBottom),
              },
            ],
            tabBarLabelStyle: styles.label,
            tabBarItemStyle: styles.item,
            tabBarBadgeStyle: styles.badge,
            tabBarIcon: tabIcons[route.name],
          })}
        >
          <Tab.Screen
            name={routes.HomeTab}
            component={HomeStack}
            options={{ title: 'Tổng quan' }}
          />
          <Tab.Screen
            name={routes.CourseTab}
            component={CourseStack}
            options={{ title: 'Môn học' }}
          />
          <Tab.Screen
            name={routes.ScheduleTab}
            component={ScheduleStack}
            options={{
              title: 'Lịch học',
              tabBarAccessibilityLabel: 'Thời khóa biểu',
            }}
          />
          <Tab.Screen
            name={routes.AssignmentTab}
            component={AssignmentStack}
            options={{ title: 'Bài tập', tabBarBadge: count || undefined }}
          />
          <Tab.Screen
            name={routes.ProfileTab}
            component={ProfileStack}
            options={{
              title: 'Cá nhân',
              tabBarAccessibilityLabel: 'Cá nhân và kết quả học tập',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}
const styles = StyleSheet.create({
  page: layout.page,
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: spacing.hairline,
    borderTopColor: colors.border,
    elevation: spacing.borderNone,
    paddingTop: spacing.xs,
  },
  label: typography.tab,
  item: { paddingVertical: spacing.xxs, minHeight: spacing.touch },
  badge: {
    backgroundColor: colors.green,
    color: colors.surface,
    fontFamily: typography.small.fontFamily,
  },
  notice: {
    ...layout.row,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.blueSoft,
  },
  noticeText: { ...layout.muted, color: colors.blue, flex: spacing.grow },
  dismiss: {
    minHeight: spacing.touch,
    minWidth: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
