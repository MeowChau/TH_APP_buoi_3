import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import layout from '../../theme/layout';
import spacing from '../../theme/spacing';
/** @param title - Tiêu đề màn hình, bắt buộc. */
export default function PageHeading({
  title,
  subtitle = '',
  index = '',
}: {
  title: string;
  subtitle?: string;
  index?: string;
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.brand}>study / space</Text>
      {index ? (
        <Text style={styles.eyebrow}>SỔ TAY SINH VIÊN / {index}</Text>
      ) : null}
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  box: { gap: spacing.sm, paddingBottom: spacing.sm },
  brand: layout.heading,
  eyebrow: layout.eyebrow,
  title: layout.title,
  subtitle: layout.muted,
});
