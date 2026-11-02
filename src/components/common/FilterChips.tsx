import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
/** @param options - Các lựa chọn, bắt buộc. @param selected - Giá trị đang chọn, bắt buộc. @param onSelect - Callback chọn, bắt buộc. */
export default function FilterChips({
  options,
  selected,
  onSelect,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map(option => (
        <Pressable
          key={option.value}
          accessibilityRole="button"
          accessibilityLabel={option.label}
          accessibilityState={{ selected: selected === option.value }}
          onPress={() => onSelect(option.value)}
          style={[styles.chip, selected === option.value && styles.active]}
        >
          <Text
            style={[
              styles.text,
              selected === option.value && styles.activeText,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  row: { gap: spacing.xs },
  chip: {
    minHeight: spacing.touch,
    minWidth: spacing.touch,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusSmall,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.greenSoft, borderColor: colors.green },
  text: { ...typography.small, color: colors.textMuted },
  activeText: { color: colors.green },
});
