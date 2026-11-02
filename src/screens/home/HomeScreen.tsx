import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useHomeData } from '../../hooks/useScreenData';
import useAssignmentActions from '../../hooks/useAssignmentActions';
import ScreenContainer from '../../components/common/ScreenContainer';
import PageHeading from '../../components/common/PageHeading';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import EmptyState from '../../components/common/EmptyState';
import AppButton from '../../components/common/AppButton';
import DetailSection from '../../components/common/DetailSection';
import CourseCard from '../../components/course/CourseCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import layout from '../../theme/layout';
import spacing from '../../theme/spacing';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.Home>) {
  const data = useHomeData();
  const actions = useAssignmentActions();
  return (
    <ScreenContainer>
      <FlatList
        data={data.upcoming}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        refreshing={data.refreshing}
        onRefresh={data.refresh}
        ListHeaderComponent={
          <View style={styles.stack}>
            <PageHeading
              index="01"
              title="Việc học hôm nay."
              subtitle="Mọi kế hoạch học tập, trong một nơi."
            />
            <QueryFeedback
              loading={data.loading}
              error={data.error}
              onRetry={data.refresh}
            />
            <LastUpdatedText timestamp={data.lastUpdated} />
            {data.student && (
              <DetailSection title={data.student.fullName}>
                <Text style={styles.muted}>
                  {data.student.studentCode} · {data.student.className}
                </Text>
                <Text style={styles.body}>
                  {data.courses.length} môn học · {data.totalCredits} tín chỉ
                </Text>
              </DetailSection>
            )}
            <DetailSection title={`${data.pendingCount} thay đổi chưa đồng bộ`}>
              <Text style={styles.muted}>
                Thao tác đã lưu trên thiết bị sẽ được gửi khi kết nối trở lại.
              </Text>
              <AppButton
                title="Đồng bộ ngay"
                variant="outline"
                loading={data.syncing}
                onPress={() => {
                  data.syncNow().catch(() => {});
                }}
              />
            </DetailSection>
            <Text accessibilityRole="header" style={styles.heading}>
              Môn học của bạn
            </Text>
            <FlatList
              horizontal
              data={data.courses}
              keyExtractor={item => String(item.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.courseRow}
              renderItem={({ item }) => (
                <CourseCard
                  compact
                  course={item}
                  onPress={() =>
                    navigation.navigate(routes.CourseDetail, { id: item.id })
                  }
                />
              )}
              ListEmptyComponent={
                data.loading || data.error ? undefined : (
                  <EmptyState
                    title="Chưa có môn học"
                    description="Các học phần sẽ xuất hiện khi máy chủ có dữ liệu."
                  />
                )
              }
            />
            <Text accessibilityRole="header" style={styles.heading}>
              Bài tập đến hạn trong 7 ngày
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={data.pendingAssignment(item.id)}
            busy={actions.isBusy(item.id)}
            onPress={() =>
              navigation.navigate(routes.AssignmentDetail, { id: item.id })
            }
            onToggleStatus={() => {
              actions.toggle(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          data.loading || data.error ? undefined : (
            <EmptyState
              title="Không có bài sắp đến hạn"
              description="Bạn có thể xem các bài khác trong tab Bài tập."
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
  heading: layout.heading,
  body: layout.body,
  muted: layout.muted,
  courseRow: { gap: spacing.md },
});
