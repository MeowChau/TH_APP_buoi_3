import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Assignment } from '../../types';
import { formatDate, formatTime, isOverdue } from '../../utils/date';
import DetailSection from '../common/DetailSection';
import SyncBadge from '../common/SyncBadge';
import StatusToggle from './StatusToggle';
import layout from '../../theme/layout';
import colors from '../../theme/colors';
/** @param assignment - Bài tập bắt buộc. @param pending - Chờ đồng bộ, bắt buộc. @param onToggleStatus - Đổi trạng thái, bắt buộc. */
export default function AssignmentDetails({
  assignment,
  pending,
  onToggleStatus,
  busy = false,
}: {
  assignment: Assignment;
  pending: boolean;
  onToggleStatus: () => void;
  busy?: boolean;
}) {
  const overdue = isOverdue(assignment.dueDate, assignment.status);
  return (
    <DetailSection title={assignment.title}>
      <Text style={styles.body}>
        {assignment.course?.name ?? 'Môn học chưa xác định'}
      </Text>
      <Text style={[styles.muted, overdue && styles.overdue]}>
        Hạn nộp: {formatTime(assignment.dueDate)},{' '}
        {formatDate(assignment.dueDate)}
      </Text>
      <View style={styles.row}>
        <StatusToggle
          status={assignment.status}
          onToggle={onToggleStatus}
          disabled={busy}
        />
        <Text style={styles.body}>
          {assignment.status === 'done' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        </Text>
      </View>
      <SyncBadge pending={pending} />
      <Text style={styles.body}>
        {assignment.description || 'Chưa có mô tả cho bài tập này.'}
      </Text>
    </DetailSection>
  );
}
const styles = StyleSheet.create({
  body: layout.body,
  muted: layout.muted,
  overdue: { color: colors.danger },
  row: layout.row,
});
