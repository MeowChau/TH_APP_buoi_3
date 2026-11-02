import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SYNC_RETRY_INTERVAL } from '../config';
import * as outbox from '../storage/outbox';
import { drainOutbox } from './syncEngine';
import { messageOf } from './queryStore';
import useNetworkStatus from './useNetworkStatus';
export default function useOutboxSync() {
  const { isOnline } = useNetworkStatus();
  const online = useRef(isOnline);
  online.current = isOnline;
  const actions = useSyncExternalStore(outbox.subscribe, outbox.getSnapshot);
  const [syncing, setSyncing] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const syncNow = useCallback(async () => {
    setSyncing(true);
    try {
      await outbox.hydrate();
      setReady(true);
      const report = await drainOutbox(() => online.current);
      const notes = [];
      if (report.count) {
        notes.push(`Đã đồng bộ ${report.count} thay đổi.`);
      }
      if (report.conflicts) {
        notes.push(
          `${report.conflicts} thay đổi có xung đột: đã giữ dữ liệu mới hơn trên máy chủ.`,
        );
      }
      if (report.failure) {
        notes.push(
          `${messageOf(
            report.failure.error,
          )} Thao tác chưa gửi được vẫn nằm trong hàng đợi.`,
        );
      }
      if (notes.length) {
        setMessage(notes.join(' '));
      }
      return report;
    } catch (error) {
      setMessage(messageOf(error));
      throw error;
    } finally {
      setSyncing(false);
    }
  }, []);
  useEffect(() => {
    const retry = () => {
      syncNow().catch(() => {});
    };
    outbox
      .hydrate()
      .then(() => {
        setReady(true);
        if (online.current) {
          retry();
        }
      })
      .catch(error => setMessage(messageOf(error)));
    if (isOnline) {
      retry();
    }
    const timer = setInterval(() => {
      if (online.current) {
        retry();
      }
    }, SYNC_RETRY_INTERVAL);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        NetInfo.refresh();
        if (online.current) {
          retry();
        }
      }
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [isOnline, syncNow]);
  return {
    isOnline,
    actions,
    pendingCount: actions.length,
    syncing,
    ready,
    syncNow,
    message,
    dismissMessage: () => setMessage(''),
  };
}
