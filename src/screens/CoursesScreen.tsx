import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { courses } from '../data/seed';
import { RootStackParamList } from '../types';
import { Brand, Empty, PageTitle, Screen } from '../components/UI';
import { CourseCard } from '../components/Cards';
import { SearchField } from '../components/SearchField';
import { Filters } from '../components/Filters';
import { normalize } from '../utils/study';
import { ui } from '../theme';
export function CoursesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');
  const [credit, setCredit] = useState('all');
  const filtered = courses.filter(
    course =>
      normalize(`${course.name} ${course.id}`).includes(normalize(query)) &&
      (credit === 'all' || course.credits === Number(credit)),
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
              index="02"
              title="Môn học."
              subtitle={`${courses.length} học phần · ${courses.reduce(
                (sum, c) => sum + c.credits,
                0,
              )} tín chỉ trong học kỳ`}
            />
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Tìm tên hoặc mã môn học..."
            />
            <Filters
              value={credit}
              onChange={setCredit}
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: '2', label: '2 tín chỉ' },
                { value: '3', label: '3 tín chỉ' },
                { value: '4', label: '4 tín chỉ' },
              ]}
            />
            <Text style={ui.eyebrow}>{filtered.length} HỌC PHẦN</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate('CourseDetail', { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <Empty
            title="Không tìm thấy môn học"
            description="Thử tên môn không dấu, mã môn hoặc chọn lại bộ lọc tín chỉ."
          />
        }
      />
    </Screen>
  );
}
