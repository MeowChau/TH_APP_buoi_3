import React from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { results, sessions } from '../data/seed';
import { useStudy } from '../context/StudyContext';
import {
  Badge,
  Button,
  Empty,
  InfoRow,
  Screen,
  Section,
} from '../components/UI';
import { AssignmentCard, SessionCard } from '../components/Cards';
import { getCourse } from '../utils/study';
import { ui } from '../theme';
export function CourseDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'CourseDetail'>) {
  const course = getCourse(route.params.id);
  const { state } = useStudy();
  if (!course) {
    return (
      <Screen detail>
        <Empty
          title="Không tìm thấy môn học"
          description="Quay lại danh sách và chọn một môn học khác."
        />
      </Screen>
    );
  }
  const courseSessions = sessions
    .filter(item => item.courseId === course.id)
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start));
  const assignments = state.assignments.filter(
    item => item.courseId === course.id,
  );
  const result = results.find(item => item.courseId === course.id);
  return (
    <Screen detail>
      <Text style={ui.eyebrow}>HỌC PHẦN / {course.id}</Text>
      <Text style={ui.title}>{course.name}</Text>
      <View style={ui.row}>
        <Badge label={`${course.credits} tín chỉ`} tone={course.color} />
        <Badge label="Đang học" />
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Thông tin học phần</Text>
        <InfoRow label="Mã môn" value={course.id} />
        <InfoRow label="Giảng viên" value={course.lecturer} />
        <InfoRow label="Tiến độ" value={`${course.progress}% chương trình`} />
        <Text style={ui.body}>{course.description}</Text>
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Cách đánh giá</Text>
        <Text style={ui.body}>{course.assessment}</Text>
        {result && (
          <Button
            label="Xem kết quả học tập"
            secondary
            onPress={() =>
              navigation.navigate('ResultDetail', { id: result.id })
            }
          />
        )}
      </View>
      <View style={{ gap: 12 }}>
        <Section title="Lịch học hằng tuần" />
        {courseSessions.map(session => (
          <View key={session.id} style={{ gap: 8 }}>
            <Text style={ui.eyebrow}>
              {session.day === 0 ? 'CHỦ NHẬT' : `THỨ ${session.day + 1}`}
            </Text>
            <SessionCard
              session={session}
              onPress={() =>
                navigation.navigate('SessionDetail', { id: session.id })
              }
            />
          </View>
        ))}
        {courseSessions.length === 0 && (
          <Empty
            title="Chưa có lịch học"
            description="Lịch học sẽ xuất hiện khi được cập nhật."
          />
        )}
      </View>
      <View style={{ gap: 12 }}>
        <Section title={`Bài tập học phần (${assignments.length})`} />
        {assignments.map(assignment => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onPress={() =>
              navigation.navigate('AssignmentDetail', { id: assignment.id })
            }
          />
        ))}
        {assignments.length === 0 && (
          <Empty
            title="Chưa có bài tập"
            description="Các yêu cầu của học phần sẽ hiển thị tại đây."
          />
        )}
      </View>
    </Screen>
  );
}
