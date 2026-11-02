import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Grade } from '../../types';
import layout from '../../theme/layout';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
/** @param grade - Kết quả bắt buộc. @param onPress - Mở chi tiết, bắt buộc. */
function GradeRow({ grade, onPress }: { grade: Grade; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Kết quả ${grade.course?.name ?? 'môn học'}, ${
        grade.total
      }, ${grade.letter}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.grow}>
        <Text style={styles.title}>
          {grade.course?.name ?? 'Môn học chưa xác định'}
        </Text>
        <Text style={styles.muted}>
          {grade.course?.credits ?? 0} tín chỉ · {grade.semester}
        </Text>
      </View>
      <Text style={styles.score}>
        {grade.total.toFixed(2)} · {grade.letter}
      </Text>
    </Pressable>
  );
}
export default memo(GradeRow);
const styles = StyleSheet.create({
  card: { ...layout.card, ...layout.row },
  grow: { flex: spacing.grow, gap: spacing.xs },
  title: layout.heading,
  muted: layout.muted,
  score: { ...layout.heading, color: colors.green },
});
