import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeStore = {
  preference: ThemePreference;
  isLoaded: boolean;
  restoreThemePreference: () => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

const THEME_STORAGE_KEY = 'rehabit.theme';
const themePreferences: ThemePreference[] = ['system', 'light', 'dark'];

const isThemePreference = (value: unknown): value is ThemePreference => {
  return typeof value === 'string' && themePreferences.includes(value as ThemePreference);
};

const applyThemePreference = (preference: ThemePreference) => {
  Appearance.setColorScheme(preference === 'system' ? null : preference);
};

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: 'system',
  isLoaded: false,

  restoreThemePreference: async () => {
    try {
      const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const nextPreference = isThemePreference(savedPreference) ? savedPreference : 'system';

      applyThemePreference(nextPreference);
      set({ preference: nextPreference, isLoaded: true });
    } catch {
      applyThemePreference('system');
      set({ preference: 'system', isLoaded: true });
    }
  },

  setThemePreference: async (preference) => {
    applyThemePreference(preference);
    set({ preference, isLoaded: true });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
  },
}));
