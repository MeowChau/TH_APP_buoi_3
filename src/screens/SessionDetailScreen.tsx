import React from 'react';
import { Text, View } from 'react-native';
import { CalendarBlank } from '../components/Icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { sessions } from '../data/seed';
import { getCourse } from '../utils/study';
import { Badge, Button, Empty, InfoRow, Screen } from '../components/UI';
import { colors, ui } from '../theme';
export function SessionDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SessionDetail'>) {
  const session = sessions.find(item => item.id === route.params.id);
  const course = session ? getCourse(session.courseId) : undefined;
  if (!session || !course) {
    return (
      <Screen detail>
        <Empty
          title="Không tìm thấy buổi học"
          description="Quay lại thời khóa biểu để chọn buổi học khác."
        />
      </Screen>
    );
  }
  return (
    <Screen detail>
      <Text style={ui.eyebrow}>LỊCH HỌC / {course.id}</Text>
      <Text style={ui.title}>{course.name}</Text>
      <View style={ui.row}>
        <Badge label={session.type} tone={course.color} />
        <Badge label="Lặp hằng tuần" tone="blue" />
      </View>
      <View style={ui.card}>
        <CalendarBlank size={30} weight="bold" color={colors[course.color]} />
        <InfoRow
          label="Ngày học"
          value={session.day === 0 ? 'Chủ nhật' : `Thứ ${session.day + 1}`}
        />
        <InfoRow
          label="Thời gian"
          value={`${session.start} – ${session.end}`}
        />
        <InfoRow label="Phòng học" value={session.room} />
        <InfoRow label="Giảng viên" value={course.lecturer} />
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Nội dung buổi học</Text>
        <Text style={ui.body}>{session.topic}</Text>
        <View style={ui.divider} />
        <Text style={ui.heading}>Chuẩn bị trước khi đến lớp</Text>
        <Text style={ui.body}>
          Đọc lại tài liệu buổi trước, mang theo máy tính và ghi lại các câu hỏi
          cần trao đổi với giảng viên.
        </Text>
      </View>
      <Button
        label="Xem thông tin môn học"
        onPress={() => navigation.navigate('CourseDetail', { id: course.id })}
      />
    </Screen>
  );
}
