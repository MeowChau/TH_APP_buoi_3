import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MagnifyingGlass, X } from '../Icons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
/** @param value - Từ khóa bắt buộc. @param onChangeText - Cập nhật từ khóa, bắt buộc. */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm…',
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.box}>
      <MagnifyingGlass size={spacing.icon} color={colors.textMuted} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoCapitalize="none"
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xóa từ khóa tìm kiếm"
          onPress={() => onChangeText('')}
          style={styles.clear}
        >
          <X size={spacing.iconSmall} color={colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    borderRadius: spacing.radiusSmall,
    paddingLeft: spacing.md,
  },
  input: {
    flex: spacing.grow,
    minHeight: spacing.input,
    ...typography.body,
    color: colors.text,
    paddingHorizontal: spacing.sm,
  },
  clear: {
    minHeight: spacing.touch,
    minWidth: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
