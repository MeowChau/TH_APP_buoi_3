import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { CheckCircle, ClipboardText } from '../components/Icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStudy } from '../context/StudyContext';
import { Badge, Button, Empty, InfoRow, Screen } from '../components/UI';
import { deadline, fullDate, getCourse } from '../utils/study';
import { colors, fonts, ui } from '../theme';
export function AssignmentDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'AssignmentDetail'>) {
  const { state, toggleAssignment, now } = useStudy();
  const [busy, setBusy] = useState(false);
  const assignment = state.assignments.find(
    item => item.id === route.params.id,
  );
  const course = assignment ? getCourse(assignment.courseId) : undefined;
  if (!assignment || !course) {
    return (
      <Screen detail>
        <Empty
          title="Không tìm thấy bài tập"
          description="Quay lại danh sách để chọn bài tập khác."
        />
      </Screen>
    );
  }
  const status = deadline(assignment, now);
  async function toggle() {
    if (!assignment) {
      return;
    }
    setBusy(true);
    try {
      await toggleAssignment(assignment.id);
    } catch (error) {
      Alert.alert(
        'Chưa lưu được',
        error instanceof Error ? error.message : 'Vui lòng thử lại.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen detail>
      <Text style={ui.eyebrow}>BÀI TẬP / {course.id}</Text>
      <Text style={ui.title}>{assignment.title}</Text>
      <Badge label={status.label} tone={status.tone} />
      <View style={ui.card}>
        <Text style={ui.heading}>{course.name}</Text>
        <InfoRow
          label="Hạn nộp"
          value={`${fullDate(assignment.due)} · 23:59`}
        />
        <InfoRow
          label="Trạng thái"
          value={assignment.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        />
        <InfoRow label="Hình thức nộp" value={assignment.format} />
      </View>
      <View style={ui.card}>
        <ClipboardText size={27} color={colors.ink} weight="bold" />
        <Text style={ui.heading}>Nội dung bài tập</Text>
        <Text style={ui.body}>{assignment.description}</Text>
        <View style={ui.divider} />
        <Text style={ui.heading}>Yêu cầu thực hiện</Text>
        {assignment.requirements.map((requirement, index) => (
          <View
            key={requirement}
            style={[ui.row, { alignItems: 'flex-start' }]}
          >
            <Text style={[ui.mono, { paddingTop: 4 }]}>
              {String(index + 1).padStart(2, '0')}
            </Text>
            <Text style={[ui.body, { flex: 1 }]}>{requirement}</Text>
          </View>
        ))}
      </View>
      {assignment.completed && (
        <View
          style={[
            ui.row,
            { padding: 16, backgroundColor: colors.greenBg, borderRadius: 8 },
          ]}
        >
          <CheckCircle size={24} weight="fill" color={colors.green} />
          <Text
            accessibilityLiveRegion="polite"
            style={[ui.body, { flex: 1, color: colors.green }]}
          >
            Đã lưu trạng thái hoàn thành.
          </Text>
        </View>
      )}
      <Button
        label={
          assignment.completed
            ? 'Đánh dấu chưa hoàn thành'
            : 'Đánh dấu đã hoàn thành'
        }
        loading={busy}
        onPress={toggle}
      />
      <Text style={[ui.muted, { fontFamily: fonts.regular }]}>
        Trạng thái này là ghi chú cá nhân. Hãy nộp bài qua kênh giảng viên yêu
        cầu.
      </Text>
      <Button
        secondary
        label="Xem môn học liên quan"
        onPress={() => navigation.navigate('CourseDetail', { id: course.id })}
      />
    </Screen>
  );
}
