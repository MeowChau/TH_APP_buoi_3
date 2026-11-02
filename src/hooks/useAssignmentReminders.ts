import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { Assignment } from '../types';
import { getPreference, setPreference } from '../storage/preferences';
import {
  getReminderCapabilities,
  openAlarmSettings,
  openNotificationSettings,
  reconcileReminders,
  requestReminderPermission,
  sendTestReminder,
} from '../notifications/reminders';
import { messageOf } from './queryStore';
const PREFERENCE = 'deadline-reminders-enabled';
export default function useAssignmentReminders(
  assignments: Assignment[],
  dataReady: boolean,
) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState({
    authorized: false,
    exactAllowed: true,
    scheduledCount: 0,
  });
  const mounted = useRef(true);
  const current = useRef({ assignments, dataReady, enabled, ready });
  current.current = { assignments, dataReady, enabled, ready };
  const revision = useRef(0);
  const refresh = useCallback(async () => {
    const value = current.current;
    if (!value.ready) {
      try {
        const saved = await getPreference(PREFERENCE, false);
        if (mounted.current) {
          setEnabled(saved);
          setReady(true);
          setError('');
        }
      } catch (failure) {
        if (mounted.current) {
          setError(messageOf(failure));
        }
      }
      return;
    }
    const token = ++revision.current;
    try {
      const result =
        value.dataReady || !value.enabled
          ? await reconcileReminders(value.assignments, value.enabled)
          : { ...(await getReminderCapabilities()), scheduledCount: 0 };
      if (mounted.current && token === revision.current) {
        setStatus(result);
        setError('');
      }
    } catch (failure) {
      if (mounted.current && token === revision.current) {
        setError(messageOf(failure));
      }
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    getPreference(PREFERENCE, false)
      .then(value => {
        if (mounted.current) {
          setEnabled(value);
          setReady(true);
        }
      })
      .catch(failure => {
        if (mounted.current) {
          setError(messageOf(failure));
        }
      });
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => {
      mounted.current = false;
      revision.current += 1;
      subscription.remove();
    };
  }, [refresh]);
  const fingerprint = JSON.stringify(
    assignments.map(item => [
      item.id,
      item.status,
      item.title,
      item.dueDate,
      item.course?.name,
    ]),
  );
  useEffect(() => {
    refresh();
  }, [fingerprint, dataReady, enabled, ready, refresh]);
  async function toggle(next: boolean) {
    setBusy(true);
    setError('');
    try {
      if (next) {
        const permission = await requestReminderPermission();
        setStatus(previous => ({ ...previous, ...permission }));
        if (!permission.authorized) {
          throw new Error(
            'Bạn chưa cho phép thông báo. Có thể bật lại trong cài đặt ứng dụng.',
          );
        }
      }
      await setPreference(PREFERENCE, next);
      setEnabled(next);
    } catch (failure) {
      setError(messageOf(failure));
    } finally {
      setBusy(false);
    }
  }
  async function test() {
    setBusy(true);
    try {
      await sendTestReminder();
      setError('');
    } catch (failure) {
      setError(messageOf(failure));
    } finally {
      setBusy(false);
    }
  }
  const openSettings = () => {
    openNotificationSettings().catch(failure => setError(messageOf(failure)));
  };
  const openExactSettings = () => {
    openAlarmSettings().catch(failure => setError(messageOf(failure)));
  };
  return {
    enabled,
    ready,
    busy,
    error,
    ...status,
    toggle,
    test,
    openSettings,
    openExactSettings,
    refresh,
  };
}
