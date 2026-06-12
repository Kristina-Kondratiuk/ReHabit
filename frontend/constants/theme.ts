/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const habitColorNames = ['yellow', 'green', 'blue', 'purple'] as const;

export type AppThemeName = 'light' | 'dark';
export type HabitColorName = (typeof habitColorNames)[number];

const commonColors = {
  white: '#FFFFFF',
  black: '#000000',
  textDark: '#ECEDEE',
  textSecondary: '#676767',
  inputBorder: '#B6B6B6',
  icon: '#9BA1A6',
  tint: '#9747FF',
  tintDark: '#7C3AED',
  overlay: 'rgba(0, 0, 0, 0.55)',
  error: '#DC2626',
  success: '#4CAF50',

  green: '#30D158',
  blue: '#64D2FF',
  yellow: '#FFD60A',
  purple: '#9747FF',
} as const;

const themedColors = {
  light: {
    text: commonColors.black,
    background: commonColors.white,
    descr: commonColors.textSecondary,
    icon: commonColors.icon,
    yellow: '#FFF5C0',
    green: '#E1F7DD',
    blue: '#DEF3FA',
    purple: '#ECE3F4',
  },
  dark: {
    text: commonColors.textDark,
    background: commonColors.black,
    grey: '#121212',
    descr: '#9BA1A6',
    icon: commonColors.icon,
    yellow: '#2B2610',
    green: '#1A2A1D',
    blue: '#162633',
    purple: '#22192D',
  },
} as const;

export const Colors = {
  common: commonColors,
  light: themedColors.light,
  dark: themedColors.dark,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
