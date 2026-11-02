import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useGradeDetail, useDetailTitle } from '../../hooks/useEntityDetails';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import DetailSection from '../../components/common/DetailSection';
import InfoRow from '../../components/profile/InfoRow';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function GradeDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.GradeDetail>) {
  const data = useGradeDetail(route.params.id);
  const grade = data.grade;
  useDetailTitle(navigation, grade?.course?.name ?? 'Chi tiết kết quả học tập');
  return (
    <ScreenContainer detail scroll>
      <QueryFeedback
        loading={data.loading}
        error={data.error}
        onRetry={data.refresh}
      />
      <LastUpdatedText timestamp={data.lastUpdated} />
      {grade && (
        <DetailSection title={grade.course?.name ?? 'Kết quả học tập'}>
          <Text style={styles.muted}>
            {grade.semester} · {grade.course?.credits ?? 0} tín chỉ
          </Text>
          <InfoRow
            label="Chuyên cần (10%)"
            value={grade.attendance.toFixed(2)}
          />
          <InfoRow label="Giữa kỳ (30%)" value={grade.midterm.toFixed(2)} />
          <InfoRow label="Cuối kỳ (60%)" value={grade.final.toFixed(2)} />
          <InfoRow label="Tổng kết" value={grade.total.toFixed(2)} />
          <InfoRow label="Điểm chữ" value={grade.letter} />
          <Text style={styles.body}>
            Điểm tổng kết = chuyên cần × 10% + giữa kỳ × 30% + cuối kỳ × 60%.
          </Text>
        </DetailSection>
      )}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({ muted: layout.muted, body: layout.body });
