import { TouchableOpacity, StyleSheet, type DimensionValue } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

type ThemedButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'choice';
  tone?: 'neutral' | 'green' | 'red';
  selected?: boolean;
  lightColor?: string;
  darkColor?: string;
  disabled?: boolean;
  width?: DimensionValue;
  height?: number;
};

export const ThemedButton = ({
  title,
  onPress,
  variant = 'primary',
  tone = 'neutral',
  selected = false,
  lightColor,
  darkColor,
  disabled = false,
  width = '100%',
  height = 60,
}: ThemedButtonProps) => {
  const primaryBackgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'purple');
  const isChoice = variant === 'choice';
  const primaryActiveBackground = Colors.common.tintDark;
  const primaryDisabledBackground = '#D1D5DB';
  const primaryActiveText = Colors.common.white;
  const primaryDisabledText = '#6B7280';
  const neutralChoiceBackground = Colors.common.white;
  const neutralChoiceShadow = Colors.common.textSecondary;
  const choiceTokens = {
    green: {
      selectedBackground: '#D8F4DD',
      selectedShadow: '#47FF66',
    },
    red: {
      selectedBackground: '#FFD6D6',
      selectedShadow: '#FF6767',
    },
    neutral: {
      selectedBackground: Colors.common.white,
      selectedShadow: '#ECEEF2',
    },
  }[tone];

  const choiceBackgroundColor = selected ? choiceTokens.selectedBackground : neutralChoiceBackground;
  const choiceShadowColor = selected ? choiceTokens.selectedShadow : neutralChoiceShadow;
  const choiceTextColor = selected ? '#111827' : Colors.common.textSecondary;

  const buttonStyle = isChoice
    ? [
        styles.button,
        styles.choiceButton,
        styles.choiceShadowBase,
        {
          backgroundColor: choiceBackgroundColor,
          shadowColor: choiceShadowColor,
          width,
          height,
          opacity: disabled ? 0.6 : 1,
          elevation: selected ? 4 : 2,
          shadowOpacity: selected ? 0.65 : 0.25,
        },
      ]
    : [
        styles.button,
        styles.primaryButton,
        {
          backgroundColor: disabled ? primaryDisabledBackground : (lightColor || darkColor ? primaryBackgroundColor : primaryActiveBackground),
          width,
          height,
        },
      ];

  const textStyle = isChoice
    ? [styles.text, styles.choiceText, { color: choiceTextColor }]
    : [styles.text, styles.primaryText, { color: disabled ? primaryDisabledText : primaryActiveText }];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isChoice ? selected : undefined }}
      style={buttonStyle}
      activeOpacity={0.85}
    >
      <ThemedText type="defaultSemiBold" style={textStyle}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    borderWidth: 0,
  },
  choiceButton: {},
  choiceShadowBase: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  text: {
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.common.white,
  },
  choiceText: {
    color: '#111827',
  },
});
