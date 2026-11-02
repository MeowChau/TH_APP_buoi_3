import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import layout from '../../theme/layout';
/** @param children - Nội dung thẻ, bắt buộc. */
export default function DetailSection({
  children,
  title = '',
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <View style={styles.card}>
      {title ? (
        <Text accessibilityRole="header" style={styles.heading}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  card: layout.card,
  heading: layout.heading,
});
