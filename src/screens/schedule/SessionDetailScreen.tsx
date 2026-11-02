import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useSessionDetail, useDetailTitle } from '../../hooks/useEntityDetails';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import DetailSection from '../../components/common/DetailSection';
import InfoRow from '../../components/profile/InfoRow';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function SessionDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.SessionDetail>) {
  const data = useSessionDetail(route.params.id);
  const session = data.session;
  useDetailTitle(navigation, session?.course?.name ?? 'Chi tiết buổi học');
  return (
    <ScreenContainer detail scroll>
      <QueryFeedback
        loading={data.loading}
        error={data.error}
        onRetry={data.refresh}
      />
      <LastUpdatedText timestamp={data.lastUpdated} />
      {session && (
        <DetailSection title={session.course?.name ?? 'Buổi học'}>
          <InfoRow
            label="Ngày học"
            value={
              session.dayOfWeek === 8 ? 'Chủ nhật' : `Thứ ${session.dayOfWeek}`
            }
          />
          <InfoRow
            label="Thời gian"
            value={`${session.startTime} – ${session.endTime}`}
          />
          <InfoRow label="Phòng học" value={session.room} />
          <Text style={styles.body}>
            {session.note || 'Chưa có ghi chú cho buổi học này.'}
          </Text>
        </DetailSection>
      )}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({ body: layout.body });
