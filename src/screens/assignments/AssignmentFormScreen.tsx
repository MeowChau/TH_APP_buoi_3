import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useAssignmentForm } from '../../hooks/useForms';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import FormInput from '../../components/common/FormInput';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function AssignmentFormScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.AssignmentForm>) {
  const form = useAssignmentForm();
  async function save() {
    try {
      if (await form.save()) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(
        'Chưa lưu được bài tập',
        error instanceof Error ? error.message : 'Vui lòng thử lại.',
      );
    }
  }
  return (
    <ScreenContainer detail scroll>
      <Text style={styles.title}>Một việc cần làm.</Text>
      <Text style={styles.body}>
        Bạn vẫn có thể thêm bài tập khi offline nếu đã tải danh sách môn học.
      </Text>
      <QueryFeedback
        loading={form.loading}
        error={form.error}
        onRetry={form.refresh}
      />
      <FormInput
        label="Tiêu đề bài tập"
        value={form.title}
        onChangeText={form.setTitle}
        error={form.errors.title}
      />
      <Text style={styles.body}>Môn học</Text>
      <FilterChips
        options={form.options}
        selected={form.courseId}
        onSelect={form.setCourseId}
      />
      {form.errors.courseId ? (
        <Text style={styles.error}>{form.errors.courseId}</Text>
      ) : null}
      {!form.options.length && !form.loading && (
        <EmptyState
          title="Chưa có môn học để chọn"
          description="Kết nối API và tải môn học trước khi thêm bài tập."
        />
      )}
      <FormInput
        label="Hạn nộp (dd/MM/yyyy)"
        placeholder="Ví dụ: 09/11/2026"
        value={form.due}
        onChangeText={form.setDue}
        error={form.errors.dueDate}
      />
      <Text style={styles.muted}>
        Hạn nộp được đặt lúc 23:59 theo giờ trên thiết bị.
      </Text>
      <FormInput
        label="Mô tả"
        value={form.description}
        onChangeText={form.setDescription}
        multiline
      />
      <AppButton
        title="Lưu bài tập"
        onPress={() => {
          save();
        }}
        loading={form.saving}
        disabled={!form.options.length}
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  title: layout.title,
  body: layout.body,
  muted: layout.muted,
  error: layout.danger,
});
