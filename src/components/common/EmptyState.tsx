import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import layout from '../../theme/layout';
import spacing from '../../theme/spacing';
/** @param title - Tiêu đề trạng thái rỗng, bắt buộc. */
export default function EmptyState({
  title,
  description = '',
  actionLabel = 'Thử lại',
  onAction = undefined,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {onAction ? (
        <AppButton title={actionLabel} onPress={onAction} variant="outline" />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  box: { ...layout.card, padding: spacing.emptyPadding, alignItems: 'center' },
  title: { ...layout.heading, textAlign: 'center' },
  description: { ...layout.muted, textAlign: 'center' },
});
