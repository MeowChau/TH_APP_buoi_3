import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useCourseList } from '../../hooks/useScreenData';
import ScreenContainer from '../../components/common/ScreenContainer';
import PageHeading from '../../components/common/PageHeading';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import EmptyState from '../../components/common/EmptyState';
import CourseCard from '../../components/course/CourseCard';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function CourseListScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.CourseList>) {
  const data = useCourseList();
  return (
    <ScreenContainer>
      <FlatList
        data={data.courses}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshing={data.refreshing}
        onRefresh={data.refresh}
        ListHeaderComponent={
          <View style={styles.stack}>
            <PageHeading
              index="02"
              title="Môn học."
              subtitle={`${data.courses.length} học phần được tìm thấy`}
            />
            <SearchBar
              value={data.search}
              onChangeText={data.setSearch}
              placeholder="Tìm tên hoặc mã môn học…"
            />
            <FilterChips
              options={data.options}
              selected={data.semester}
              onSelect={data.setSemester}
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
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(routes.CourseDetail, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          data.loading || data.error ? undefined : (
            <EmptyState
              title="Không tìm thấy môn học"
              description="Thử tên môn không dấu, mã môn hoặc chọn lại học kỳ."
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
