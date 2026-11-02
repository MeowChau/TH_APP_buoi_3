import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import layout from '../../theme/layout';
/** @param label - Nhãn bắt buộc. @param value - Giá trị bắt buộc. @param onChangeText - Callback bắt buộc. */
export default function FormInput({
  label,
  value,
  onChangeText,
  error = '',
  keyboardType = 'default',
  multiline = false,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        style={[
          styles.input,
          multiline && styles.multiline,
          Boolean(error) && styles.invalid,
        ]}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  box: { gap: spacing.xs },
  label: layout.body,
  input: {
    ...typography.body,
    color: colors.text,
    minHeight: spacing.input,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusSmall,
    padding: spacing.md,
  },
  multiline: { minHeight: spacing.input * 2, textAlignVertical: 'top' },
  invalid: { borderColor: colors.danger },
  error: layout.danger,
});
