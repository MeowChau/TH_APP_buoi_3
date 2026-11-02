import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { CACHE_TTL } from '../config';
import { getQuery, runQuery } from './queryStore';
import useNetworkStatus from './useNetworkStatus';
export default function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
) {
  const { isOnline } = useNetworkStatus();
  const entry = getQuery<T>(key);
  const subscribe = useCallback(
    (listener: () => void) => {
      entry.listeners.add(listener);
      return () => {
        entry.listeners.delete(listener);
      };
    },
    [entry],
  );
  const snapshot = useSyncExternalStore(subscribe, () => entry.state);
  const refresh = useCallback(
    () => runQuery(key, fetcher, isOnline, true),
    [key, fetcher, isOnline],
  );
  useEffect(() => {
    runQuery(key, fetcher, isOnline);
  }, [key, fetcher, isOnline]);
  return {
    ...snapshot,
    refresh,
    isStale:
      !snapshot.lastUpdated ||
      Date.now() - Date.parse(snapshot.lastUpdated) > CACHE_TTL,
  };
}
