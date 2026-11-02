import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useAssignmentList } from '../../hooks/useScreenData';
import useAssignmentActions from '../../hooks/useAssignmentActions';
import ScreenContainer from '../../components/common/ScreenContainer';
import PageHeading from '../../components/common/PageHeading';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function AssignmentListScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.AssignmentList>) {
  const data = useAssignmentList();
  const actions = useAssignmentActions();
  return (
    <ScreenContainer>
      <FlatList
        data={data.filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshing={data.refreshing}
        onRefresh={data.refresh}
        ListHeaderComponent={
          <View style={styles.stack}>
            <PageHeading
              index="04"
              title="Từng việc, một chút."
              subtitle="Bài tập và những hạn nộp cần nhớ."
            />
            <AppButton
              title="Thêm bài tập"
              onPress={() => navigation.navigate(routes.AssignmentForm)}
            />
            <SearchBar
              value={data.search}
              onChangeText={data.setSearch}
              placeholder="Tìm bài tập hoặc môn học…"
            />
            <FilterChips
              options={data.options}
              selected={data.status}
              onSelect={data.setStatus}
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
              title="Không có bài tập phù hợp"
              description="Thử bộ lọc khác hoặc thêm một bài tập mới."
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
