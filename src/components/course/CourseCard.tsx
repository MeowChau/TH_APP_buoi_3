import React, { memo } from 'react';
import { Pressable, PixelRatio, StyleSheet, Text, View } from 'react-native';
import type { Course } from '../../types';
import { BookOpen, CaretRight } from '../Icons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import layout from '../../theme/layout';
/** @param course - Môn học bắt buộc. @param onPress - Mở chi tiết, bắt buộc. */
function CourseCard({
  course,
  onPress,
  compact = false,
}: {
  course: Course;
  onPress: () => void;
  compact?: boolean;
}) {
  const fontScale = PixelRatio.getFontScale();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.name}, ${course.credits} tín chỉ. Xem chi tiết`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compact,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.between}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <BookOpen size={spacing.icon} color={colors.green} weight="bold" />
          </View>
          <Text style={styles.code}>{course.code}</Text>
        </View>
        <Text style={styles.badge}>{course.credits} tín chỉ</Text>
      </View>
      <View
        style={[
          styles.between,
          compact && { minHeight: spacing.compactTitle * fontScale },
        ]}
      >
        <Text numberOfLines={compact ? 2 : undefined} style={styles.title}>
          {course.name}
        </Text>
        <CaretRight
          size={spacing.iconSmall}
          color={colors.textMuted}
          weight="bold"
        />
      </View>
      <Text numberOfLines={compact ? 1 : undefined} style={styles.muted}>
        {course.lecturer}
      </Text>
      {!compact && <Text style={styles.muted}>{course.semester}</Text>}
    </Pressable>
  );
}
export default memo(CourseCard);
const styles = StyleSheet.create({
  card: layout.card,
  compact: { width: spacing.cardWidth },
  between: layout.between,
  row: layout.row,
  icon: {
    width: spacing.iconBox,
    height: spacing.iconBox,
    borderRadius: spacing.radiusSmall,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: layout.mono,
  badge: {
    ...typography.small,
    color: colors.green,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.pill,
  },
  title: {
    ...typography.strong,
    flex: spacing.grow,
    color: colors.text,
    includeFontPadding: false,
  },
  muted: layout.muted,
});
