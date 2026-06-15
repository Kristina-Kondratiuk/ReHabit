import { useThemeStore } from '@/src/store/theme-store';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  return useThemeStore((state) => state.resolvedTheme);
}
