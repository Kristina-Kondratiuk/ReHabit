import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={activeTheme}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: activeTheme.colors.background }}
          edges={['top']}
        >
          <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
