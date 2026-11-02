import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import layout from '../../theme/layout';
export default function LoadingView({
  message = 'Đang tải…',
}: {
  message?: string;
}) {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={colors.green} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: layout.muted,
});
