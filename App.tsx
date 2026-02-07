/**
 * ChatBot App
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChatScreen } from './ChatScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ChatScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
