import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useProfileData } from '../../hooks/useScreenData';
import ScreenContainer from '../../components/common/ScreenContainer';
import PageHeading from '../../components/common/PageHeading';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import EmptyState from '../../components/common/EmptyState';
import AppButton from '../../components/common/AppButton';
import DetailSection from '../../components/common/DetailSection';
import SyncBadge from '../../components/common/SyncBadge';
import InfoRow from '../../components/profile/InfoRow';
import ReminderSettings from '../../components/profile/ReminderSettings';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function ProfileScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.Profile>) {
  const data = useProfileData();
  return (
    <ScreenContainer>
      <FlatList
        data={data.grades}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        refreshing={data.refreshing}
        onRefresh={data.refresh}
        ListHeaderComponent={
          <View style={styles.stack}>
            <PageHeading
              index="05"
              title="Hành trình của bạn."
              subtitle="Thông tin cá nhân và kết quả học tập."
            />
            <QueryFeedback
              loading={data.loading}
              error={data.error}
              onRetry={data.refresh}
            />
            <LastUpdatedText timestamp={data.lastUpdated} />
            {data.student && (
              <DetailSection title="Hồ sơ sinh viên">
                <SyncBadge pending={data.pendingProfile} />
                <InfoRow
                  label="Mã sinh viên"
                  value={data.student.studentCode}
                />
                <InfoRow label="Họ và tên" value={data.student.fullName} />
                <InfoRow label="Lớp" value={data.student.className} />
                <InfoRow label="Ngành" value={data.student.major} />
                <InfoRow label="Email" value={data.student.email} />
                <InfoRow label="Điện thoại" value={data.student.phone} />
                <AppButton
                  title="Chỉnh sửa thông tin"
                  variant="outline"
                  onPress={() => navigation.navigate(routes.EditProfile)}
                />
              </DetailSection>
            )}
            <ReminderSettings
              {...data.reminders}
              onToggle={data.reminders.toggle}
              onTest={data.reminders.test}
              onOpenSettings={data.reminders.openSettings}
              onOpenExactSettings={data.reminders.openExactSettings}
              onRetry={data.reminders.refresh}
            />
            <GpaSummary
              gpa={data.summary.gpa}
              totalCredits={data.summary.totalCredits}
            />
            <AppButton
              title="Điểm theo học kỳ"
              onPress={() => navigation.navigate(routes.GradeList)}
            />
          </View>
        }
        renderItem={({ item }) => (
          <GradeRow
            grade={{
              ...item,
              course:
                data.courses.find(
                  course => String(course.id) === String(item.courseId),
                ) ?? item.course,
            }}
            onPress={() =>
              navigation.navigate(routes.GradeDetail, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          data.loading || data.error ? undefined : (
            <EmptyState
              title="Chưa có kết quả học tập"
              description="Điểm sẽ xuất hiện sau khi được cập nhật trên máy chủ."
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
