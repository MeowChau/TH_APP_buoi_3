import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import layout from '../../theme/layout';
import spacing from '../../theme/spacing';
import colors from '../../theme/colors';
/** @param enabled - Đang bật, bắt buộc. @param ready - Đã đọc cài đặt, bắt buộc. @param busy - Đang thao tác, bắt buộc. @param authorized - Có quyền thông báo, bắt buộc. @param exactAllowed - Có quyền nhắc đúng giờ, bắt buộc. @param scheduledCount - Số lịch đã đặt, bắt buộc. @param onToggle - Bật/tắt, bắt buộc. @param onTest - Gửi thử, bắt buộc. @param onOpenSettings - Mở quyền thông báo, bắt buộc. @param onOpenExactSettings - Mở quyền báo thức, bắt buộc. @param onRetry - Thử lại khi có lỗi, bắt buộc. */
export default function ReminderSettings({
  enabled,
  ready,
  busy,
  authorized,
  exactAllowed,
  scheduledCount,
  onToggle,
  onTest,
  onOpenSettings,
  onOpenExactSettings,
  onRetry,
  error = '',
}: {
  enabled: boolean;
  ready: boolean;
  busy: boolean;
  authorized: boolean;
  exactAllowed: boolean;
  scheduledCount: number;
  onToggle: (enabled: boolean) => void;
  onTest: () => void;
  onOpenSettings: () => void;
  onOpenExactSettings: () => void;
  onRetry: () => void;
  error?: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text accessibilityRole="header" style={styles.title}>
          Nhắc hạn bài tập
        </Text>
        <View style={styles.target}>
          <Switch
            accessibilityLabel="Nhắc bài tập trước hạn 24 giờ"
            value={enabled}
            disabled={!ready || busy}
            onValueChange={onToggle}
            hitSlop={spacing.xs}
            trackColor={{ false: colors.border, true: colors.green }}
            thumbColor={colors.surface}
          />
        </View>
      </View>
      <Text style={styles.body}>
        Nhắc các bài chưa hoàn thành trước hạn nộp 24 giờ, kể cả khi ứng dụng
        đóng hoặc không có mạng.
      </Text>
      <Text style={styles.muted}>
        {!ready
          ? 'Đang đọc cài đặt…'
          : enabled
          ? `Đã đặt ${scheduledCount} lịch nhắc.`
          : 'Bạn chưa bật nhắc hạn.'}
      </Text>
      {enabled && !exactAllowed && (
        <>
          <Text style={styles.muted}>
            Cho phép “Báo thức và lời nhắc” để thông báo đúng giờ. Khi chưa cho
            phép, Android có thể gửi chậm.
          </Text>
          <AppButton
            title="Cho phép nhắc đúng giờ"
            variant="outline"
            onPress={onOpenExactSettings}
          />
        </>
      )}
      {!authorized && (
        <AppButton
          title="Mở cài đặt thông báo"
          variant="outline"
          onPress={onOpenSettings}
        />
      )}
      <AppButton
        title="Gửi thông báo thử"
        variant="outline"
        disabled={!enabled || !authorized || busy}
        onPress={onTest}
        loading={busy}
      />
      {error ? (
        <>
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
          <AppButton
            title="Thử lại lịch nhắc"
            variant="outline"
            onPress={onRetry}
          />
        </>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  card: layout.card,
  row: layout.between,
  title: { ...layout.heading, flex: spacing.grow },
  target: {
    minHeight: spacing.touch,
    minWidth: spacing.touch,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: layout.body,
  muted: layout.muted,
  error: layout.danger,
});
