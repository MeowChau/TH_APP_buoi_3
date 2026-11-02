import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import layout from '../../theme/layout';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
/** @param gpa - GPA hệ 4 bắt buộc. @param totalCredits - Tín chỉ tích lũy bắt buộc. */
export default function GpaSummary({
  gpa,
  totalCredits,
}: {
  gpa: number;
  totalCredits: number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>KẾT QUẢ HỌC TẬP</Text>
      <Text style={styles.value}>{gpa.toFixed(2)} / 4.00</Text>
      <Text style={styles.body}>{totalCredits} tín chỉ tích lũy</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { ...layout.card, backgroundColor: colors.greenSoft },
  label: layout.eyebrow,
  value: { ...typography.number, color: colors.green },
  body: layout.body,
});
