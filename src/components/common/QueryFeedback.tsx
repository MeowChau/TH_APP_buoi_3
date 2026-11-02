import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoadingView from './LoadingView';
import ErrorView from './ErrorView';
import layout from '../../theme/layout';
/** @param loading - Đang tải, bắt buộc. @param onRetry - Thử lại, bắt buộc. */
export default function QueryFeedback({
  loading,
  onRetry,
  error = null,
}: {
  loading: boolean;
  onRetry: () => void;
  error?: string | null;
}) {
  return (
    <View style={styles.box}>
      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={onRetry} />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({ box: layout.stack });
