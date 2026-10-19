import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { BookOpen, Check, Clock, MapPin } from './Icons';
import { Assignment, Course, Session } from '../types';
import { colors, fonts, ui } from '../theme';
import { Badge, Chevron } from './UI';
import { deadline, getCourse, shortDate } from '../utils/study';
import { useStudy } from '../context/StudyContext';

export function CourseCard({
  course,
  onPress,
  compact = false,
}: {
  course: Course;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.name}, ${course.credits} tín chỉ. Xem chi tiết`}
      onPress={onPress}
      style={({ pressed }) => [ui.card, { opacity: pressed ? 0.65 : 1 }]}
    >
      <View style={ui.between}>
        <View style={ui.row}>
          <View
            style={[
              styles.courseIcon,
              { backgroundColor: colors[`${course.color}Bg`] },
            ]}
          >
            <BookOpen size={20} weight="bold" color={colors[course.color]} />
          </View>
          <Text style={ui.mono}>{course.id}</Text>
        </View>
        <Badge label={`${course.credits} tín chỉ`} tone={course.color} />
      </View>
      <View style={ui.between}>
        <Text style={[ui.heading, { flex: 1, fontSize: 15 }]}>
          {course.name}
        </Text>
        <Chevron />
      </View>
      {!compact && (
        <>
          <Text style={ui.muted}>{course.lecturer}</Text>
          <View style={ui.divider} />
          <View style={ui.between}>
            <Text style={ui.muted}>Tiến độ học phần</Text>
            <Text style={ui.mono}>{course.progress}%</Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${course.progress}%`,
                  backgroundColor: colors[course.color],
                },
              ]}
            />
          </View>
        </>
      )}
    </Pressable>
  );
}
export function AssignmentCard({
  assignment,
  onPress,
}: {
  assignment: Assignment;
  onPress: () => void;
}) {
  const { toggleAssignment, now } = useStudy();
  const [busy, setBusy] = useState(false);
  const course = getCourse(assignment.courseId);
  const status = deadline(assignment, now);
  async function toggle() {
    setBusy(true);
    try {
      await toggleAssignment(assignment.id);
    } catch (error) {
      Alert.alert(
        'Chưa lưu được',
        error instanceof Error ? error.message : 'Vui lòng thử lại.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={[ui.card, { padding: 16, gap: 10 }]}>
      <View style={[ui.row, { alignItems: 'flex-start', gap: 10 }]}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={`Hoàn thành: ${assignment.title}`}
          accessibilityState={{ checked: assignment.completed, disabled: busy }}
          disabled={busy}
          onPress={toggle}
          style={styles.checkTarget}
        >
          <View
            style={[styles.checkbox, assignment.completed && styles.checked]}
          >
            {assignment.completed && (
              <Check size={14} weight="bold" color={colors.surface} />
            )}
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Chi tiết ${assignment.title}`}
          onPress={onPress}
          style={{ flex: 1, gap: 9, paddingTop: 4 }}
        >
          <Text
            style={[
              ui.body,
              { fontFamily: fonts.medium },
              assignment.completed && { color: colors.muted },
            ]}
          >
            {assignment.title}
          </Text>
          <Text style={ui.muted}>{course?.name}</Text>
          <View style={ui.between}>
            <View style={[ui.row, { gap: 5 }]}>
              <Clock size={13} color={colors.muted} />
              <Text style={ui.mono}>{shortDate(assignment.due)} · 23:59</Text>
            </View>
            <Chevron />
          </View>
        </Pressable>
      </View>
      <View style={{ paddingLeft: 44 }}>
        <Badge label={status.label} tone={status.tone} />
      </View>
    </View>
  );
}
export function SessionCard({
  session,
  onPress,
}: {
  session: Session;
  onPress: () => void;
}) {
  const course = getCourse(session.courseId);
  if (!course) {
    return null;
  }
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        ui.card,
        styles.session,
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <View
        style={[
          styles.sessionAccent,
          { backgroundColor: colors[course.color] },
        ]}
      />
      <View style={{ gap: 5, width: 46 }}>
        <Text style={styles.time}>{session.start}</Text>
        <Text style={ui.mono}>{session.end}</Text>
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={[ui.body, { fontFamily: fonts.medium }]}>
          {course.name}
        </Text>
        <View style={[ui.row, { gap: 5 }]}>
          <MapPin size={13} color={colors.muted} weight="bold" />
          <Text style={ui.muted}>
            {session.room} · {session.type}
          </Text>
        </View>
      </View>
      <Chevron />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  courseIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  fill: { height: 4, borderRadius: 2 },
  checkTarget: {
    width: 34,
    minHeight: 44,
    alignItems: 'center',
    paddingTop: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#B9BBB4',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: colors.green, borderColor: colors.green },
  session: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 17,
    overflow: 'hidden',
  },
  sessionAccent: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 3,
  },
  time: { fontFamily: fonts.mono, fontSize: 13, color: colors.ink },
});
