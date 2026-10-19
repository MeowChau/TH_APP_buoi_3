import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { sessions } from '../data/seed';
import { useStudy } from '../context/StudyContext';
import {
  Brand,
  Empty,
  IconButton,
  PageTitle,
  Screen,
  Section,
} from '../components/UI';
import { SessionCard } from '../components/Cards';
import { addDays, dayTitle, mondayOf, shortDate } from '../utils/study';
import { colors, fonts, ui } from '../theme';
export function TimetableScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { now } = useStudy();
  const [week, setWeek] = useState(() => mondayOf(now));
  const [day, setDay] = useState((now.getDay() + 6) % 7);
  const selected = addDays(week, day);
  const filtered = sessions
    .filter(item => item.day === selected.getDay())
    .sort((a, b) => a.start.localeCompare(b.start));
  const goToday = () => {
    setWeek(mondayOf(now));
    setDay((now.getDay() + 6) % 7);
  };
  return (
    <Screen scroll={false}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={ui.content}
        ListHeaderComponent={
          <View style={{ gap: 22 }}>
            <Brand />
            <PageTitle
              index="03"
              title="Thời khóa biểu."
              subtitle={`${sessions.length} buổi học mỗi tuần · Lịch lặp hằng tuần`}
            />
            <View style={ui.card}>
              <View style={ui.between}>
                <IconButton
                  label="Tuần trước"
                  direction="left"
                  onPress={() => setWeek(previous => addDays(previous, -7))}
                />
                <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <Text style={[ui.body, { fontFamily: fonts.medium }]}>
                    {shortDate(week)} – {shortDate(addDays(week, 6))}
                  </Text>
                  <Text style={ui.mono}>
                    {week.getFullYear()}
                    {week.getFullYear() !== addDays(week, 6).getFullYear()
                      ? ` / ${addDays(week, 6).getFullYear()}`
                      : ''}
                  </Text>
                </View>
                <IconButton
                  label="Tuần sau"
                  onPress={() => setWeek(previous => addDays(previous, 7))}
                />
              </View>
              <View style={ui.divider} />
              <View style={styles.days}>
                {Array.from({ length: 7 }, (_, index) => {
                  const date = addDays(week, index);
                  const isToday = date.toDateString() === now.toDateString();
                  const hasClass = sessions.some(
                    item => item.day === date.getDay(),
                  );
                  return (
                    <Pressable
                      key={index}
                      accessibilityRole="button"
                      accessibilityLabel={`${dayTitle(date)}, ${shortDate(
                        date,
                      )}`}
                      accessibilityState={{ selected: day === index }}
                      onPress={() => setDay(index)}
                      style={[styles.day, day === index && styles.selected]}
                    >
                      <Text
                        style={[styles.dayLabel, day === index && styles.white]}
                      >
                        {index === 6 ? 'CN' : `T${index + 2}`}
                      </Text>
                      <Text
                        style={[
                          styles.dayNumber,
                          day === index && styles.white,
                          isToday && day !== index && { color: colors.green },
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor: hasClass
                              ? day === index
                                ? colors.surface
                                : colors.green
                              : 'transparent',
                          },
                        ]}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <Section
              title={`${dayTitle(selected)}, ${shortDate(selected)}`}
              action="Hôm nay"
              onPress={goToday}
            />
            <Text style={ui.eyebrow}>{filtered.length} BUỔI HỌC</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate('SessionDetail', { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <Empty
            title="Một ngày không có lịch học"
            description="Chọn ngày có dấu chấm để xem buổi học. Bạn có thể dành hôm nay cho tự học và nghỉ ngơi."
          />
        }
        ListFooterComponent={
          <Text style={[ui.muted, { textAlign: 'center' }]}>
            Chạm buổi học để xem phòng học và nội dung.
          </Text>
        }
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  days: { flexDirection: 'row', gap: 3 },
  day: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 7,
    borderRadius: 6,
    minHeight: 77,
  },
  selected: { backgroundColor: colors.ink },
  dayLabel: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  dayNumber: { fontFamily: fonts.medium, fontSize: 15, color: colors.ink },
  white: { color: colors.surface },
  dot: { width: 4, height: 4, borderRadius: 2 },
});
