import React, { createContext, useContext } from 'react';
import useOutboxSync from '../hooks/useOutboxSync';
const SyncContext = createContext<ReturnType<typeof useOutboxSync> | null>(
  null,
);
/** @param children - Nội dung ứng dụng bắt buộc. */
export default function SyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useOutboxSync();
  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
export function useSync() {
  const value = useContext(SyncContext);
  if (!value) {
    throw new Error('Thiếu SyncProvider.');
  }
  return value;
}
