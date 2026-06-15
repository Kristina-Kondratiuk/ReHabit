import { useThemeStore } from '@/src/store/theme-store';

export function useColorScheme() {
  return useThemeStore((state) => state.resolvedTheme);
}
