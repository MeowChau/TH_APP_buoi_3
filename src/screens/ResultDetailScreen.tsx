import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { results } from '../data/seed';
import { getCourse, grade, resultScore } from '../utils/study';
import { Badge, Button, Empty, InfoRow, Screen } from '../components/UI';
import { colors, fonts, ui } from '../theme';
export function ResultDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'ResultDetail'>) {
  const result = results.find(item => item.id === route.params.id);
  const course = result ? getCourse(result.courseId) : undefined;
  if (!result || !course) {
    return (
      <Screen detail>
        <Empty
          title="Không tìm thấy kết quả"
          description="Quay lại bảng điểm để chọn học phần khác."
        />
      </Screen>
    );
  }
  const score = resultScore(result);
  const converted = grade(score);
  return (
    <Screen detail>
      <Text style={ui.eyebrow}>KẾT QUẢ HỌC TẬP / {course.id}</Text>
      <Text style={ui.title}>{course.name}</Text>
      <Badge label={result.semester} tone="blue" />
      <View style={ui.card}>
        <Text style={ui.eyebrow}>ĐIỂM TỔNG KẾT</Text>
        <View style={[ui.between, { alignItems: 'baseline' }]}>
          <View style={[ui.row, { alignItems: 'baseline' }]}>
            <Text style={styles.score}>{score.toFixed(2)}</Text>
            <Text style={ui.muted}>/ 10</Text>
          </View>
          <Badge
            label={`${converted.letter} · ${converted.label}`}
            tone={converted.points >= 3 ? 'green' : 'yellow'}
          />
        </View>
        <InfoRow label="Điểm hệ 4" value={converted.points.toFixed(1)} />
        <InfoRow label="Số tín chỉ" value={`${course.credits} tín chỉ`} />
        <InfoRow
          label="Kết quả"
          value={score >= 4 ? 'Đạt học phần' : 'Chưa đạt học phần'}
        />
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Điểm thành phần</Text>
        <View style={styles.tableRow}>
          <Text style={[ui.eyebrow, { flex: 1 }]}>HẠNG MỤC</Text>
          <Text style={ui.eyebrow}>TỶ TRỌNG</Text>
          <Text style={[ui.eyebrow, { width: 44, textAlign: 'right' }]}>
            ĐIỂM
          </Text>
        </View>
        {result.parts.map(part => (
          <View key={part.name} style={styles.tableRow}>
            <Text style={[ui.body, { flex: 1 }]}>{part.name}</Text>
            <Text style={[ui.mono, { width: 60, textAlign: 'center' }]}>
              {part.weight}%
            </Text>
            <Text
              style={[
                ui.heading,
                { width: 44, textAlign: 'right', fontSize: 15 },
              ]}
            >
              {part.score.toFixed(1)}
            </Text>
          </View>
        ))}
        <Text style={ui.muted}>
          Điểm tổng kết = tổng (điểm thành phần × tỷ trọng).
        </Text>
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Nhận xét của giảng viên</Text>
        <Text style={ui.body}>{result.feedback}</Text>
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Thang quy đổi mẫu</Text>
        <Text style={ui.muted}>
          A: 8,5–10 → 4,0 · B: 7–dưới 8,5 → 3,0{'\n'}C: 5,5–dưới 7 → 2,0 · D:
          4–dưới 5,5 → 1,0{'\n'}F: dưới 4 → 0. Thang điểm minh họa cho bài thực
          hành.
        </Text>
      </View>
      <Button
        secondary
        label="Xem thông tin học phần"
        onPress={() => navigation.navigate('CourseDetail', { id: course.id })}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  score: {
    fontFamily: fonts.serif,
    fontSize: 64,
    lineHeight: 78,
    color: colors.ink,
    letterSpacing: -2,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
