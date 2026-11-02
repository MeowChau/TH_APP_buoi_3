import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Assignment } from '../../types';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, formatTime, isOverdue } from '../../utils/date';
import layout from '../../theme/layout';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
/** @param assignment - Bài tập bắt buộc. @param pending - Chờ đồng bộ, bắt buộc. @param onPress - Mở chi tiết, bắt buộc. @param onToggleStatus - Đổi trạng thái, bắt buộc. */
function AssignmentItem({
  assignment,
  pending,
  onPress,
  onToggleStatus,
  busy = false,
}: {
  assignment: Assignment;
  pending: boolean;
  onPress: () => void;
  onToggleStatus: () => void;
  busy?: boolean;
}) {
  const overdue = isOverdue(assignment.dueDate, assignment.status);
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <StatusToggle
          status={assignment.status}
          onToggle={onToggleStatus}
          disabled={busy}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Chi tiết ${assignment.title}`}
          onPress={onPress}
          style={styles.content}
        >
          <Text style={styles.title}>{assignment.title}</Text>
          <Text style={styles.muted}>
            {assignment.course?.name ?? 'Môn học chưa xác định'}
          </Text>
          <Text style={[styles.muted, overdue && styles.overdue]}>
            {formatTime(assignment.dueDate)}, {formatDate(assignment.dueDate)}
          </Text>
          <Text style={[styles.status, overdue && styles.overdue]}>
            {assignment.status === 'done'
              ? 'Đã hoàn thành'
              : overdue
              ? 'Quá hạn'
              : 'Chưa hoàn thành'}
          </Text>
          <SyncBadge pending={pending} />
        </Pressable>
      </View>
    </View>
  );
}
export default memo(AssignmentItem);
const styles = StyleSheet.create({
  card: layout.card,
  row: { ...layout.row, alignItems: 'flex-start' },
  content: { flex: spacing.grow, gap: spacing.xs, minHeight: spacing.touch },
  title: layout.heading,
  muted: layout.muted,
  overdue: { color: colors.danger },
  status: { ...layout.muted, color: colors.green },
});
