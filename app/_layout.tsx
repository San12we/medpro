import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TaskProvider } from '../context/TaskContext'; // Import TaskProvider
import { Provider } from 'react-redux';
import store from '../app/(redux)/store'; // Import the store
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../app/(services)/queryClient'; // Import the query client

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}> 
      <QueryClientProvider client={queryClient}> {/* Wrap with QueryClientProvider */}
        <TaskProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="initial" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(tabs)/task" /> 
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="addtask" />
              <Stack.Screen name="auth/register" />
              <Stack.Screen name="payment" />
              <Stack.Screen name="insurance" />
              <Stack.Screen name="clinic" />
              <Stack.Screen name="professional" />
              <Stack.Screen name="personal" />
              <Stack.Screen 
                name="onboarding/index" 
                options={{ 
                  title: "Welcome", 
                  headerShown: false,
                  headerStyle: { backgroundColor: '#f4511e' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' }
                }} 
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </TaskProvider>
      </QueryClientProvider>
    </Provider>
  );
}
