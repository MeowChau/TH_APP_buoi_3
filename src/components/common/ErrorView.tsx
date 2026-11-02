import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WarningCircle } from '../Icons';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import layout from '../../theme/layout';
/** @param message - Nội dung lỗi, bắt buộc. @param onRetry - Thử lại, bắt buộc. */
export default function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View accessibilityRole="alert" style={styles.box}>
      <WarningCircle size={spacing.icon} color={colors.danger} weight="bold" />
      <Text style={styles.text}>{message}</Text>
      <AppButton title="Thử lại" onPress={onRetry} variant="outline" />
    </View>
  );
}
const styles = StyleSheet.create({
  box: { ...layout.card, backgroundColor: colors.dangerSoft },
  text: layout.danger,
});
