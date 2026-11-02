import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
/** @param pending - Có thao tác chờ đồng bộ, bắt buộc. */
export default function SyncBadge({ pending }: { pending: boolean }) {
  return pending ? (
    <View style={styles.badge}>
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  ) : null;
}
const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    borderRadius: spacing.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  text: { ...typography.small, color: colors.warning },
});
