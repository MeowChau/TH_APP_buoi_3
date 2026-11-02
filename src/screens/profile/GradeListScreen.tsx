import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useGrades } from '../../hooks/useScreenData';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function GradeListScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.GradeList>) {
  const data = useGrades();
  return (
    <ScreenContainer detail>
      <FlatList
        data={data.grades}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        refreshing={data.refreshing}
        onRefresh={data.refresh}
        ListHeaderComponent={
          <View style={styles.stack}>
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
            <GpaSummary
              gpa={data.summary.gpa}
              totalCredits={data.summary.totalCredits}
            />
          </View>
        }
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(routes.GradeDetail, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          data.loading || data.error ? undefined : (
            <EmptyState
              title="Học kỳ này chưa có điểm"
              description="Chọn học kỳ khác hoặc kéo xuống để làm mới."
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
