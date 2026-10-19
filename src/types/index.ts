export type Profile = {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  major: string;
  school: string;
};
export type Course = {
  id: string;
  name: string;
  credits: number;
  lecturer: string;
  color: 'green' | 'blue' | 'yellow' | 'red';
  description: string;
  assessment: string;
  progress: number;
};
export type Session = {
  id: string;
  courseId: string;
  day: number;
  start: string;
  end: string;
  room: string;
  topic: string;
  type: string;
};
export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  due: string;
  completed: boolean;
  description: string;
  requirements: string[];
  format: string;
};
export type GradePart = { name: string; weight: number; score: number };
export type Result = {
  id: string;
  courseId: string;
  semester: string;
  parts: GradePart[];
  feedback: string;
};
export type StudyState = {
  version: 1;
  profile: Profile;
  assignments: Assignment[];
};
export type TabParamList = {
  Overview: undefined;
  Courses: undefined;
  Timetable: undefined;
  Assignments: undefined;
  Profile: undefined;
};
export type RootStackParamList = {
  Main: undefined;
  CourseDetail: { id: string };
  SessionDetail: { id: string };
  AssignmentDetail: { id: string };
  ResultDetail: { id: string };
  EditProfile: undefined;
};
