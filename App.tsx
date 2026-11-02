import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppDataProvider from './src/context/AppDataContext';
import SyncProvider from './src/context/SyncContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SyncProvider>
        <AppDataProvider>
          <AppNavigator />
        </AppDataProvider>
      </SyncProvider>
    </SafeAreaProvider>
  );
}
