import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Session } from '../../types';
import layout from '../../theme/layout';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { CaretRight } from '../Icons';
/** @param session - Buổi học bắt buộc. @param onPress - Mở chi tiết, bắt buộc. */
function SessionCard({
  session,
  onPress,
}: {
  session: Session;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Chi tiết ${session.course?.name ?? 'buổi học'}, ${
        session.startTime
      }`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.grow}>
        <Text style={styles.time}>
          {session.startTime} – {session.endTime}
        </Text>
        <Text style={styles.title}>
          {session.course?.name ?? 'Môn học chưa xác định'}
        </Text>
        <Text style={styles.room}>Phòng {session.room}</Text>
      </View>
      <CaretRight
        size={spacing.iconSmall}
        color={colors.textMuted}
        weight="bold"
      />
    </Pressable>
  );
}
export default memo(SessionCard);
const styles = StyleSheet.create({
  card: { ...layout.card, ...layout.row },
  grow: { flex: spacing.grow, gap: spacing.xs },
  time: layout.mono,
  title: layout.heading,
  room: layout.muted,
});
