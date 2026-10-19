import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PencilSimple, GraduationCap } from '../components/Icons';
import { RootStackParamList } from '../types';
import { results } from '../data/seed';
import { useStudy } from '../context/StudyContext';
import {
  Badge,
  Brand,
  Chevron,
  InfoRow,
  PageTitle,
  Screen,
  Section,
} from '../components/UI';
import { getCourse, grade, resultScore, semesterSummary } from '../utils/study';
import { colors, fonts, ui } from '../theme';
export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state } = useStudy();
  const { profile } = state;
  const summary = semesterSummary(results);
  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map(part => part[0])
    .join('');
  return (
    <Screen scroll={false}>
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={ui.content}
        ListHeaderComponent={
          <View style={{ gap: 22 }}>
            <Brand />
            <PageTitle
              index="05"
              title="Góc cá nhân."
              subtitle="Thông tin sinh viên & kết quả học tập"
            />
            <View style={ui.card}>
              <View style={[ui.between, { alignItems: 'flex-start' }]}>
                <View style={styles.avatar}>
                  <Text style={styles.initials}>{initials}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Chỉnh sửa thông tin cá nhân"
                  onPress={() => navigation.navigate('EditProfile')}
                  style={styles.edit}
                >
                  <PencilSimple size={18} weight="bold" color={colors.ink} />
                  <Text style={ui.muted}>Chỉnh sửa</Text>
                </Pressable>
              </View>
              <Text style={ui.heading}>{profile.name}</Text>
              <Text style={ui.muted}>{profile.school}</Text>
              <Badge label="Sinh viên chính quy" />
              <View>
                <InfoRow label="Mã sinh viên" value={profile.studentId} />
                <InfoRow label="Lớp" value={profile.className} />
                <InfoRow label="Ngành học" value={profile.major} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Số điện thoại" value={profile.phone} />
              </View>
            </View>
            <Section title="Kết quả học tập" />
            <View style={styles.summary}>
              <View style={ui.between}>
                <Text style={ui.eyebrow}>HỌC KỲ HIỆN TẠI</Text>
                <GraduationCap size={24} weight="bold" color={colors.green} />
              </View>
              <View style={[ui.row, { alignItems: 'baseline' }]}>
                <Text style={styles.gpa}>{summary.gpa.toFixed(2)}</Text>
                <Text style={ui.muted}>/ 4.00 GPA</Text>
              </View>
              <View style={ui.divider} />
              <View style={ui.between}>
                <View style={{ gap: 3 }}>
                  <Text style={ui.eyebrow}>ĐIỂM TRUNG BÌNH</Text>
                  <Text style={ui.heading}>
                    {summary.average.toFixed(2)} / 10
                  </Text>
                </View>
                <View style={{ gap: 3, alignItems: 'flex-end' }}>
                  <Text style={ui.eyebrow}>TÍN CHỈ ĐẠT</Text>
                  <Text style={ui.heading}>
                    {summary.passed} / {summary.credits}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={ui.eyebrow}>
              BẢNG ĐIỂM CHI TIẾT · {results.length} HỌC PHẦN
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const course = getCourse(item.courseId);
          const score = resultScore(item);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Kết quả ${course?.name}, ${score.toFixed(
                2,
              )} điểm`}
              onPress={() =>
                navigation.navigate('ResultDetail', { id: item.id })
              }
              style={[ui.card, ui.row, { padding: 17 }]}
            >
              <View style={{ flex: 1, gap: 7 }}>
                <Text style={ui.mono}>
                  {item.courseId} · {course?.credits} tín chỉ
                </Text>
                <Text style={[ui.body, { fontFamily: fonts.medium }]}>
                  {course?.name}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 7 }}>
                <Text style={ui.heading}>{score.toFixed(2)}</Text>
                <Badge
                  label={grade(score).letter}
                  tone={grade(score).points >= 3 ? 'green' : 'yellow'}
                />
              </View>
              <Chevron />
            </Pressable>
          );
        }}
        ListFooterComponent={
          <View style={{ gap: 12 }}>
            <Text style={ui.muted}>
              Điểm và hồ sơ là dữ liệu mẫu phục vụ bài thực hành. GPA được tính
              theo số tín chỉ.
            </Text>
            <Text style={[ui.eyebrow, { textAlign: 'center' }]}>
              STUDY / SPACE · PHIÊN BẢN 1.0
            </Text>
          </View>
        }
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenBg,
  },
  initials: { fontFamily: fonts.serif, fontSize: 25, color: colors.green },
  edit: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 44 },
  summary: {
    backgroundColor: '#F0F0E9',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 22,
    gap: 13,
  },
  gpa: {
    fontFamily: fonts.serif,
    fontSize: 60,
    letterSpacing: -2,
    lineHeight: 72,
    color: colors.ink,
  },
});
