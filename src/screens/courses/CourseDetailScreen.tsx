import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useCourseDetail, useDetailTitle } from '../../hooks/useEntityDetails';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import DetailSection from '../../components/common/DetailSection';
import EmptyState from '../../components/common/EmptyState';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import useAssignmentActions from '../../hooks/useAssignmentActions';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function CourseDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.CourseDetail>) {
  const data = useCourseDetail(route.params.id);
  const actions = useAssignmentActions();
  useDetailTitle(navigation, data.course?.name ?? 'Chi tiết môn học');
  return (
    <ScreenContainer detail>
      <FlatList
        data={data.assignments}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        refreshing={data.refreshing}
        onRefresh={data.refresh}
        ListHeaderComponent={
          <View style={styles.stack}>
            <QueryFeedback
              loading={data.loading}
              error={data.error}
              onRetry={data.refresh}
            />
            <LastUpdatedText timestamp={data.lastUpdated} />
            {data.course && (
              <DetailSection title={data.course.name}>
                <Text style={styles.muted}>
                  {data.course.code} · {data.course.credits} tín chỉ ·{' '}
                  {data.course.semester}
                </Text>
                <Text style={styles.body}>{data.course.lecturer}</Text>
                <Text style={styles.body}>{data.course.description}</Text>
              </DetailSection>
            )}
            <Text style={styles.heading}>Lịch học của môn</Text>
            <FlatList
              data={data.sessions}
              keyExtractor={item => String(item.id)}
              scrollEnabled={false}
              contentContainerStyle={styles.stack}
              renderItem={({ item }) => (
                <SessionCard
                  session={item}
                  onPress={() =>
                    navigation.navigate(routes.SessionDetail, { id: item.id })
                  }
                />
              )}
              ListEmptyComponent={<EmptyState title="Chưa có buổi học" />}
            />
            <Text style={styles.heading}>Bài tập của môn</Text>
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
            <EmptyState title="Chưa có bài tập" />
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
});
