import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { CheckSquare, Square } from '../Icons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
/** @param status - Trạng thái bắt buộc. @param onToggle - Callback đổi trạng thái, bắt buộc. */
export default function StatusToggle({
  status,
  onToggle,
  disabled = false,
}: {
  status: 'todo' | 'done';
  onToggle: () => void;
  disabled?: boolean;
}) {
  const Icon = status === 'done' ? CheckSquare : Square;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={
        status === 'done'
          ? 'Đánh dấu chưa hoàn thành'
          : 'Đánh dấu đã hoàn thành'
      }
      accessibilityState={{ checked: status === 'done', disabled }}
      disabled={disabled}
      onPress={onToggle}
      style={styles.target}
    >
      <Icon
        size={spacing.iconLarge}
        color={status === 'done' ? colors.green : colors.textMuted}
        weight="bold"
      />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  target: {
    width: spacing.touch,
    minHeight: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
