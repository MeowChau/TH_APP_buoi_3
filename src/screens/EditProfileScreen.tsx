import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStudy } from '../context/StudyContext';
import { Button, Screen } from '../components/UI';
import { colors, ui } from '../theme';
import { validateProfile } from '../utils/validation';
export function EditProfileScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'EditProfile'>) {
  const { state, updateProfile } = useStudy();
  const [name, setName] = useState(state.profile.name);
  const [email, setEmail] = useState(state.profile.email);
  const [phone, setPhone] = useState(state.profile.phone);
  const [errors, setErrors] = useState<ReturnType<typeof validateProfile>>({});
  const [busy, setBusy] = useState(false);
  const headerHeight = useHeaderHeight();
  async function save() {
    const validation = validateProfile({ name, email, phone });
    setErrors(validation);
    if (Object.keys(validation).length) {
      return;
    }
    setBusy(true);
    try {
      await updateProfile({
        name: name.trim().replace(/\s+/g, ' '),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/[\s.-]/g, ''),
      });
      navigation.goBack();
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
    <KeyboardAvoidingView
      style={ui.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <Screen detail>
        <Text style={ui.eyebrow}>THÔNG TIN SINH VIÊN</Text>
        <Text style={ui.title}>Một chút về bạn.</Text>
        <Text style={ui.muted}>
          Cập nhật thông tin liên hệ. Mã sinh viên, lớp và ngành học được giữ
          theo hồ sơ.
        </Text>
        <View style={{ gap: 9 }}>
          <Text style={ui.body}>Họ và tên</Text>
          <TextInput
            accessibilityLabel="Họ và tên"
            editable={!busy}
            value={name}
            onChangeText={setName}
            maxLength={80}
            autoCapitalize="words"
            textContentType="name"
            style={[
              ui.input,
              errors.name ? { borderColor: colors.red } : undefined,
            ]}
          />
          {errors.name && (
            <Text
              accessibilityRole="alert"
              style={[ui.muted, { color: colors.red }]}
            >
              {errors.name}
            </Text>
          )}
        </View>
        <View style={{ gap: 9 }}>
          <Text style={ui.body}>Email</Text>
          <TextInput
            accessibilityLabel="Email"
            editable={!busy}
            value={email}
            onChangeText={setEmail}
            maxLength={120}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            style={[
              ui.input,
              errors.email ? { borderColor: colors.red } : undefined,
            ]}
          />
          {errors.email && (
            <Text
              accessibilityRole="alert"
              style={[ui.muted, { color: colors.red }]}
            >
              {errors.email}
            </Text>
          )}
        </View>
        <View style={{ gap: 9 }}>
          <Text style={ui.body}>Số điện thoại</Text>
          <TextInput
            accessibilityLabel="Số điện thoại"
            editable={!busy}
            value={phone}
            onChangeText={setPhone}
            maxLength={18}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            style={[
              ui.input,
              errors.phone ? { borderColor: colors.red } : undefined,
            ]}
          />
          {errors.phone && (
            <Text
              accessibilityRole="alert"
              style={[ui.muted, { color: colors.red }]}
            >
              {errors.phone}
            </Text>
          )}
        </View>
        <Button label="Lưu thay đổi" loading={busy} onPress={save} />
        <Button
          secondary
          label="Hủy chỉnh sửa"
          loading={busy}
          onPress={() => navigation.goBack()}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
