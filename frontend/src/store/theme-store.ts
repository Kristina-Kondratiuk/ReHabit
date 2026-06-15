import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';

export type ThemePreference = 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

type ThemeStore = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  isLoaded: boolean;
  restoreThemePreference: () => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

const THEME_STORAGE_KEY = 'rehabit.theme';
const themePreferences: ThemePreference[] = ['light', 'dark'];

const isThemePreference = (value: unknown): value is ThemePreference => {
  return typeof value === 'string' && themePreferences.includes(value as ThemePreference);
};

const applyThemePreference = (preference: ThemePreference) => {
  Appearance.setColorScheme(preference);
};

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: 'light',
  resolvedTheme: 'light',
  isLoaded: false,

  restoreThemePreference: async () => {
    try {
      const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const nextPreference = isThemePreference(savedPreference) ? savedPreference : 'light';

      applyThemePreference(nextPreference);
      set({
        preference: nextPreference,
        resolvedTheme: nextPreference,
        isLoaded: true,
      });
    } catch {
      applyThemePreference('light');
      set({
        preference: 'light',
        resolvedTheme: 'light',
        isLoaded: true,
      });
    }
  },

  setThemePreference: async (preference) => {
    applyThemePreference(preference);
    set({
      preference,
      resolvedTheme: preference,
      isLoaded: true,
    });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
  },
}));
