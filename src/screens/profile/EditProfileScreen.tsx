import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import { useProfileForm } from '../../hooks/useForms';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import layout from '../../theme/layout';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function EditProfileScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.EditProfile>) {
  const form = useProfileForm();
  async function save() {
    try {
      if (await form.save()) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(
        'Chưa lưu được hồ sơ',
        error instanceof Error ? error.message : 'Vui lòng thử lại.',
      );
    }
  }
  return (
    <ScreenContainer detail scroll>
      <Text style={styles.title}>Thông tin của bạn.</Text>
      <Text style={styles.body}>
        Thay đổi khi offline được lưu trên thiết bị và tự đồng bộ khi có mạng.
      </Text>
      <QueryFeedback
        loading={form.loading}
        error={form.error}
        onRetry={form.refresh}
      />
      <FormInput
        label="Họ và tên"
        value={form.input.fullName}
        onChangeText={value => form.setField('fullName', value)}
        error={form.errors.fullName}
      />
      <FormInput
        label="Email"
        value={form.input.email}
        onChangeText={value => form.setField('email', value)}
        keyboardType="email-address"
        error={form.errors.email}
      />
      <FormInput
        label="Số điện thoại"
        value={form.input.phone}
        onChangeText={value => form.setField('phone', value)}
        keyboardType="phone-pad"
        error={form.errors.phone}
      />
      <AppButton
        title="Lưu thông tin"
        onPress={() => {
          save();
        }}
        loading={form.saving}
        disabled={!form.initialized}
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({ title: layout.title, body: layout.body });
