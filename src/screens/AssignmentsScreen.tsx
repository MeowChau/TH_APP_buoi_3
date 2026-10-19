import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStudy } from '../context/StudyContext';
import { Brand, Empty, PageTitle, Screen } from '../components/UI';
import { AssignmentCard } from '../components/Cards';
import { Filters } from '../components/Filters';
import { SearchField } from '../components/SearchField';
import { getCourse, normalize } from '../utils/study';
import { ui } from '../theme';
export function AssignmentsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state, now } = useStudy();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const pending = state.assignments.filter(item => !item.completed).length;
  const overdue = state.assignments.filter(
    item => !item.completed && new Date(item.due) < now,
  ).length;
  const filtered = state.assignments
    .filter(
      item =>
        (filter === 'all' ||
          (filter === 'pending' && !item.completed) ||
          (filter === 'completed' && item.completed) ||
          (filter === 'overdue' &&
            !item.completed &&
            new Date(item.due) < now)) &&
        normalize(`${item.title} ${getCourse(item.courseId)?.name}`).includes(
          normalize(query),
        ),
    )
    .sort(
      (a, b) =>
        Number(a.completed) - Number(b.completed) || a.due.localeCompare(b.due),
    );
  return (
    <Screen scroll={false}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={ui.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={{ gap: 22 }}>
            <Brand />
            <PageTitle
              index="04"
              title="Bài tập."
              subtitle={`${pending} bài chưa hoàn thành · ${overdue} bài đã quá hạn`}
            />
            <View style={ui.card}>
              <Text style={ui.heading}>Hoàn thành từng việc nhỏ.</Text>
              <Text style={ui.muted}>
                Chạm ô vuông để cập nhật trạng thái, hoặc chạm tên bài để xem
                yêu cầu chi tiết.
              </Text>
            </View>
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Tìm bài tập hoặc môn học..."
            />
            <Filters
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: `Tất cả (${state.assignments.length})` },
                { value: 'pending', label: `Chưa xong (${pending})` },
                {
                  value: 'completed',
                  label: `Đã xong (${state.assignments.length - pending})`,
                },
                { value: 'overdue', label: `Quá hạn (${overdue})` },
              ]}
            />
            <Text accessibilityLiveRegion="polite" style={ui.eyebrow}>
              {filtered.length} BÀI TẬP
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <AssignmentCard
            assignment={item}
            onPress={() =>
              navigation.navigate('AssignmentDetail', { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <Empty
            title="Không có bài tập phù hợp"
            description="Thử từ khóa khác hoặc chọn Tất cả để xem lại danh sách."
          />
        }
      />
    </Screen>
  );
}
