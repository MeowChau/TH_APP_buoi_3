import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
/** @param title - Nhãn nút, bắt buộc. @param onPress - Xử lý bấm, bắt buộc. */
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'outline' && styles.outline,
        { opacity: disabled || loading ? 0.5 : pressed ? 0.7 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.text : colors.onPrimary}
        />
      ) : (
        <Text
          style={[styles.text, variant === 'outline' && styles.outlineText]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: spacing.input,
    minWidth: spacing.touch,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusSmall,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
  },
  text: {
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    color: colors.onPrimary,
  },
  outlineText: { color: colors.text },
});
