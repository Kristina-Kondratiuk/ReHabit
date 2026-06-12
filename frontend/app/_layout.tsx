import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/src/context/auth-context';
import { useThemeStore } from '@/src/store/theme-store';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const restoreThemePreference = useThemeStore((state) => state.restoreThemePreference);
  const isDark = colorScheme === 'dark';
  const appBackground = isDark ? Colors.dark.background : Colors.light.background;

  useEffect(() => {
    void restoreThemePreference();
  }, [restoreThemePreference]);

  const activeTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        background: appBackground,
      },
    }),
    [appBackground, isDark]
  );

  return (
    <SafeAreaProvider>
      <ThemeProvider value={activeTheme}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: appBackground }}
          edges={['top']}
        >
          <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar
            style={isDark ? 'light' : 'dark'}
            backgroundColor={appBackground}
            translucent={false}
          />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
