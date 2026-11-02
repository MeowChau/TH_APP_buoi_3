import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useSchedule } from '../../hooks/useScreenData';
import ScreenContainer from '../../components/common/ScreenContainer';
import PageHeading from '../../components/common/PageHeading';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import EmptyState from '../../components/common/EmptyState';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function ScheduleScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.Schedule>) {
  const data = useSchedule();
  return (
    <ScreenContainer>
      <FlatList
        data={data.sessions}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        refreshing={data.refreshing}
        onRefresh={data.refresh}
        ListHeaderComponent={
          <View style={styles.stack}>
            <PageHeading
              index="03"
              title="Lịch học."
              subtitle="Thời khóa biểu lặp lại mỗi tuần."
            />
            <DaySelector
              selectedDay={data.selectedDay}
              onSelectDay={data.setSelectedDay}
            />
            <QueryFeedback
              loading={data.loading}
              error={data.error}
              onRetry={data.refresh}
            />
            <LastUpdatedText timestamp={data.lastUpdated} />
          </View>
        }
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(routes.SessionDetail, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          data.loading || data.error ? undefined : (
            <EmptyState
              title="Hôm nay không có lịch học"
              description="Chọn ngày khác để xem buổi học tiếp theo."
            />
          )
        }
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  content: layout.content,
  stack: layout.stack,
});
