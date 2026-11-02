import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfflineBanner from './OfflineBanner';
import layout from '../../theme/layout';
/** @param children - Nội dung màn hình, bắt buộc. */
export default function ScreenContainer({
  children,
  scroll = false,
  detail = false,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  detail?: boolean;
}) {
  return (
    <SafeAreaView
      style={styles.page}
      edges={detail ? ['left', 'right', 'bottom'] : ['top', 'left', 'right']}
    >
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.page}>{children}</View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: layout.page,
  content: layout.content,
});
