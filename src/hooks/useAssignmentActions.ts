import { useState } from 'react';
import { Alert } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { messageOf } from './queryStore';
import type { Id } from '../types';
export default function useAssignmentActions() {
  const { toggleAssignment } = useAppData();
  const [busyIds, setBusyIds] = useState<string[]>([]);
  async function toggle(id: Id) {
    if (busyIds.includes(String(id))) {
      return;
    }
    setBusyIds(previous => [...previous, String(id)]);
    try {
      await toggleAssignment(id);
    } catch (error) {
      Alert.alert('Chưa cập nhật được', messageOf(error));
    } finally {
      setBusyIds(previous => previous.filter(value => value !== String(id)));
    }
  }
  return { toggle, isBusy: (id: Id) => busyIds.includes(String(id)) };
}
