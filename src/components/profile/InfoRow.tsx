import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import layout from '../../theme/layout';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
/** @param label - Nhãn bắt buộc. @param value - Giá trị bắt buộc. */
export default function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text selectable style={styles.value}>
        {value}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    ...layout.between,
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: spacing.hairline,
    borderBottomColor: colors.border,
  },
  label: { ...layout.muted, flex: spacing.grow },
  value: { ...layout.body, flex: 2, textAlign: 'right' },
});
