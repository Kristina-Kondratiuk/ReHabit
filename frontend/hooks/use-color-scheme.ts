import { useColorScheme as useNativeColorScheme } from 'react-native';

import { useThemeStore } from '@/src/store/theme-store';

export function useColorScheme() {
  const systemTheme = useNativeColorScheme();
  const preference = useThemeStore((state) => state.preference);

  if (preference === 'system') {
    return systemTheme ?? 'light';
  }

  return preference;
}
