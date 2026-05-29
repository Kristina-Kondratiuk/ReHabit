/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColor = '#9747FF';
export const habitColorNames = ['yellow', 'green', 'blue', 'purple'] as const;

export type AppThemeName = 'light' | 'dark';
export type HabitColorName = (typeof habitColorNames)[number];
type HabitShadowColorName = `${HabitColorName}Shadow`;

export const Colors = {
  light: {
    text: '#000000',
    background: '#fff',
    tint: tintColor,
    icon: '#B6B6B6',
    tabIconDefault: '#B6B6B6',
    tabIconSelected: tintColor,
    yellow: '#FFF5C0',
    green: '#E1F7DD',
    blue: '#DEF3FA',
    purple: '#ECE3F4',
    yellowShadow: '#FFD60A',
    greenShadow: '#47FF66',
    blueShadow: '#30B0C7',
    purpleShadow: tintColor,
  },
  dark: {
    text: '#ECEDEE',
    background: '#000000',
    tint: tintColor,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColor,
    yellow: '#2B2610',
    green: '#1A2A1D',
    blue: '#162633',
    purple: '#22192D',
    yellowShadow: '#FFD60A',
    greenShadow: '#30D158',
    blueShadow: '#64D2FF',
    purpleShadow: tintColor,
  },
};

export const getHabitColorTokens = (theme: AppThemeName, color: HabitColorName) => {
  const shadowKey = `${color}Shadow` as HabitShadowColorName;

  return {
    background: Colors[theme][color],
    border: Colors[theme][shadowKey],
    shadow: Colors.dark[shadowKey],
  };
};

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
