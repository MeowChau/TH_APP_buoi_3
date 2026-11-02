import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { formatDate, formatTime } from '../../utils/date';
import layout from '../../theme/layout';
export default function LastUpdatedText({
  timestamp = null,
}: {
  timestamp?: string | null;
}) {
  return timestamp ? (
    <Text style={styles.text}>
      Cập nhật lần cuối: {formatTime(timestamp)}, {formatDate(timestamp)}
    </Text>
  ) : null;
}
const styles = StyleSheet.create({ text: layout.muted });
