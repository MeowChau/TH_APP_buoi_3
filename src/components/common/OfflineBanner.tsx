import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  return isOnline ? null : (
    <View accessibilityRole="alert" style={styles.banner}>
      <Text style={styles.text}>Bạn đang offline</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  banner: { padding: spacing.sm, backgroundColor: colors.warningSoft },
  text: { ...typography.small, color: colors.warning, textAlign: 'center' },
});
