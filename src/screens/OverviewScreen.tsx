import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalendarBlank, ArrowUpRight } from '../components/Icons';
import { RootStackParamList, TabParamList } from '../types';
import { useStudy } from '../context/StudyContext';
import { courses, sessions } from '../data/seed';
import { Brand, Badge, Empty, Screen, Section } from '../components/UI';
import { AssignmentCard, CourseCard, SessionCard } from '../components/Cards';
import { colors, fonts, ui } from '../theme';
import { dayTitle, shortDate } from '../utils/study';
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Overview'>,
  NativeStackScreenProps<RootStackParamList>
>;
export function OverviewScreen({ navigation }: Props) {
  const { state, now } = useStudy();
  const pending = state.assignments.filter(item => !item.completed);
  const overdue = pending.filter(item => new Date(item.due) < now);
  const upcoming = pending
    .filter(item => new Date(item.due) >= now)
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 3);
  const todaySessions = sessions
    .filter(item => item.day === now.getDay())
    .sort((a, b) => a.start.localeCompare(b.start));
  const done = state.assignments.length - pending.length;
  const initials = state.profile.name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map(part => part[0])
    .join('');
  return (
    <Screen>
      <Brand
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mở hồ sơ cá nhân"
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </Pressable>
        }
      />
      <View style={{ gap: 10 }}>
        <Text style={ui.eyebrow}>
          {dayTitle(now)} · {shortDate(now)} / {now.getFullYear()}
        </Text>
        <Text style={ui.title}>Việc học hôm nay.</Text>
        <Text style={ui.body}>
          Chào {state.profile.name.split(' ').slice(-2).join(' ')}, cùng sắp xếp
          một ngày học tập.
        </Text>
      </View>
      <View style={ui.card}>
        <View style={ui.between}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={ui.eyebrow}>HỒ SƠ SINH VIÊN</Text>
            <Text style={ui.heading}>{state.profile.name}</Text>
            <Text style={ui.mono}>
              {state.profile.studentId} · {state.profile.className}
            </Text>
          </View>
          <Badge label="Đang học" />
        </View>
        <View style={ui.divider} />
        <View style={ui.row}>
          {[
            { value: `${courses.length}`.padStart(2, '0'), label: 'Môn học' },
            {
              value: `${courses.reduce((sum, c) => sum + c.credits, 0)}`,
              label: 'Tín chỉ',
            },
            {
              value: `${pending.length}`.padStart(2, '0'),
              label: 'Bài cần làm',
            },
          ].map((item, index) => (
            <View
              key={item.label}
              style={[styles.stat, index > 0 && styles.statBorder]}
            >
              <Text style={styles.statNumber}>{item.value}</Text>
              <Text style={ui.muted}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.focus}>
        <View style={ui.between}>
          <Text style={ui.eyebrow}>TỪNG VIỆC, MỘT CHÚT</Text>
          <Text style={ui.mono}>
            {done}/{state.assignments.length}
          </Text>
        </View>
        <Text style={styles.focusTitle}>
          {done === state.assignments.length
            ? 'Bạn đã hoàn thành tất cả.'
            : `Còn ${pending.length} bài tập đang chờ bạn.`}
        </Text>
        <View style={styles.progress}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  (done / Math.max(state.assignments.length, 1)) * 100
                }%`,
              },
            ]}
          />
        </View>
        <Text style={ui.muted}>
          {done} bài đã hoàn thành. Tiến độ được lưu trên thiết bị.
        </Text>
      </View>
      <View style={{ gap: 12 }}>
        <Section
          title="Lịch học hôm nay"
          action="Xem lịch"
          onPress={() => navigation.navigate('Timetable')}
        />
        {todaySessions.length ? (
          todaySessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onPress={() =>
                navigation.navigate('SessionDetail', { id: session.id })
              }
            />
          ))
        ) : (
          <View style={ui.card}>
            <CalendarBlank size={26} weight="bold" color={colors.green} />
            <Text style={ui.heading}>Hôm nay không có lịch học</Text>
            <Text style={ui.muted}>
              Dành thời gian ôn tập hoặc chuẩn bị cho buổi học tiếp theo.
            </Text>
          </View>
        )}
      </View>
      <View style={{ gap: 12 }}>
        <Section
          title="Bài tập sắp đến hạn"
          action="Tất cả"
          onPress={() => navigation.navigate('Assignments')}
        />
        {overdue.length > 0 && (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Assignments')}
            style={styles.overdue}
          >
            <Text style={[ui.muted, { color: colors.red, flex: 1 }]}>
              {overdue.length} bài tập đã quá hạn cần xử lý
            </Text>
            <ArrowUpRight size={17} weight="bold" color={colors.red} />
          </Pressable>
        )}
        {upcoming.length ? (
          upcoming.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onPress={() =>
                navigation.navigate('AssignmentDetail', { id: assignment.id })
              }
            />
          ))
        ) : (
          <Empty
            title="Không có bài sắp đến hạn"
            description="Bạn có thể kiểm tra các bài còn lại trong tab Bài tập."
          />
        )}
      </View>
      <View style={{ gap: 12 }}>
        <Section
          title="Môn học của bạn"
          action="Tất cả"
          onPress={() => navigation.navigate('Courses')}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={courses}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <View style={{ width: 260 }}>
              <CourseCard
                compact
                course={item}
                onPress={() =>
                  navigation.navigate('CourseDetail', { id: item.id })
                }
              />
            </View>
          )}
        />
      </View>
      <Text style={[ui.eyebrow, { textAlign: 'center' }]}>
        STUDY / SPACE · HỌC TẬP CÓ KẾ HOẠCH
      </Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenBg,
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 12, color: colors.green },
  stat: { flex: 1, gap: 3, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderLeftColor: colors.border },
  statNumber: { fontFamily: fonts.serif, fontSize: 32, color: colors.ink },
  focus: {
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#F0F0E9',
    gap: 13,
  },
  focusTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 34,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  progress: { height: 5, backgroundColor: '#DFE1D8', borderRadius: 3 },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: colors.green },
  overdue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.redBg,
  },
});
