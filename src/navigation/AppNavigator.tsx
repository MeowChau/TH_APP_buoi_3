import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  BookOpen,
  CalendarBlank,
  CheckSquare,
  House,
  UserCircle,
} from '../components/Icons';
import { RootStackParamList, TabParamList } from '../types';
import { OverviewScreen } from '../screens/OverviewScreen';
import { CoursesScreen } from '../screens/CoursesScreen';
import { TimetableScreen } from '../screens/TimetableScreen';
import { AssignmentsScreen } from '../screens/AssignmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';
import { SessionDetailScreen } from '../screens/SessionDetailScreen';
import { AssignmentDetailScreen } from '../screens/AssignmentDetailScreen';
import { ResultDetailScreen } from '../screens/ResultDetailScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { useStudy } from '../context/StudyContext';
import { Notice } from '../components/UI';
import { colors, fonts, ui } from '../theme';
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const icons = {
  Overview: House,
  Courses: BookOpen,
  Timetable: CalendarBlank,
  Assignments: CheckSquare,
  Profile: UserCircle,
};
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 70 + Math.max(insets.bottom, 9),
            paddingBottom: Math.max(insets.bottom, 9),
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color }) => {
          const Icon = icons[route.name];
          return (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Icon
                size={22}
                weight={focused ? 'fill' : 'bold'}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{ title: 'Tổng quan' }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{ title: 'Môn học' }}
      />
      <Tab.Screen
        name="Timetable"
        component={TimetableScreen}
        options={{
          title: 'Lịch học',
          tabBarAccessibilityLabel: 'Thời khóa biểu',
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{ title: 'Bài tập' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Cá nhân',
          tabBarAccessibilityLabel: 'Cá nhân và kết quả học tập',
        }}
      />
    </Tab.Navigator>
  );
}
export function AppNavigator() {
  const { loading, storageError, retry } = useStudy();
  if (loading) {
    return (
      <SafeAreaView style={[ui.page, styles.loading]}>
        <BookOpen size={34} color={colors.ink} weight="bold" />
        <Text style={ui.heading}>study / space</Text>
        <ActivityIndicator color={colors.green} />
        <Text style={ui.muted}>Đang mở sổ tay của bạn...</Text>
      </SafeAreaView>
    );
  }
  return (
    <View style={ui.page}>
      {storageError && (
        <SafeAreaView edges={['top']} style={{ backgroundColor: colors.redBg }}>
          <Notice message={storageError} onRetry={retry} />
        </SafeAreaView>
      )}
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: colors.bg,
            card: colors.surface,
            text: colors.ink,
            primary: colors.ink,
            border: colors.border,
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.ink,
            headerTitleStyle: { fontFamily: fonts.medium, fontSize: 14 },
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetailScreen}
            options={{ title: 'Chi tiết môn học' }}
          />
          <Stack.Screen
            name="SessionDetail"
            component={SessionDetailScreen}
            options={{ title: 'Chi tiết buổi học' }}
          />
          <Stack.Screen
            name="AssignmentDetail"
            component={AssignmentDetailScreen}
            options={{ title: 'Chi tiết bài tập' }}
          />
          <Stack.Screen
            name="ResultDetail"
            component={ResultDetailScreen}
            options={{ title: 'Kết quả học tập' }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: 'Chỉnh sửa hồ sơ', gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 0,
    height: 78,
    paddingTop: 8,
    paddingBottom: 9,
  },
  tabItem: { paddingVertical: 3 },
  tabLabel: { fontFamily: fonts.medium, fontSize: 9, lineHeight: 16 },
  tabIcon: {
    width: 43,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: { backgroundColor: colors.greenBg },
  loading: { alignItems: 'center', justifyContent: 'center', gap: 20 },
});
