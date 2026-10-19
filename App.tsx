import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudyProvider } from './src/context/StudyContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <StudyProvider>
        <AppNavigator />
      </StudyProvider>
    </SafeAreaProvider>
  );
}
