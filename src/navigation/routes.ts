import type { Id } from '../types';
export const routes = {
  HomeTab: 'HomeTab',
  CourseTab: 'CourseTab',
  ScheduleTab: 'ScheduleTab',
  AssignmentTab: 'AssignmentTab',
  ProfileTab: 'ProfileTab',
  Home: 'Home',
  CourseList: 'CourseList',
  CourseDetail: 'CourseDetail',
  Schedule: 'Schedule',
  SessionDetail: 'SessionDetail',
  AssignmentList: 'AssignmentList',
  AssignmentDetail: 'AssignmentDetail',
  AssignmentForm: 'AssignmentForm',
  Profile: 'Profile',
  EditProfile: 'EditProfile',
  GradeList: 'GradeList',
  GradeDetail: 'GradeDetail',
} as const;
export type StackParamList = {
  [routes.Home]: undefined;
  [routes.CourseList]: undefined;
  [routes.CourseDetail]: { id: Id };
  [routes.Schedule]: undefined;
  [routes.SessionDetail]: { id: Id };
  [routes.AssignmentList]: undefined;
  [routes.AssignmentDetail]: { id: Id };
  [routes.AssignmentForm]: undefined;
  [routes.Profile]: undefined;
  [routes.EditProfile]: undefined;
  [routes.GradeList]: undefined;
  [routes.GradeDetail]: { id: Id };
};
export type TabParamList = {
  [routes.HomeTab]: undefined;
  [routes.CourseTab]: undefined;
  [routes.ScheduleTab]: undefined;
  [routes.AssignmentTab]: undefined;
  [routes.ProfileTab]: undefined;
};
