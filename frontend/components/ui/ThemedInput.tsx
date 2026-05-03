import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  type TextInputProps,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedInputProps = {
  lightColor?: string;
  darkColor?: string;
  type?: 'text' | 'password' | 'confirmPassword' | 'email';
  placeholder?: string;
} & TextInputProps;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ThemedInput = ({
  lightColor,
  darkColor,
  type = 'text',
  placeholder,
  onFocus,
  onBlur,
  style,
  ...rest
}: ThemedInputProps) => {
  const focusAnim = useRef(new Animated.Value(0)).current;
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const animateFocus = (toValue: 0 | 1) => {
    Animated.timing(focusAnim, {
      toValue,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const animatedBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#B6B6B6', Colors.light.tint],
  });

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    animateFocus(1);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    animateFocus(0);
    onBlur?.(e);
  };

  return (
    <AnimatedTextInput
      style={[styles.input, { borderColor: animatedBorderColor, color: textColor }, style]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      underlineColorAndroid="transparent"
      placeholder={placeholder}
      keyboardType={type === 'email' ? 'email-address' : 'default'}
      secureTextEntry={type === 'password' || type === 'confirmPassword'}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 11,
    width: '100%',
    height: 56,
    fontSize: 16,
    fontWeight: '500',
    borderColor: '#B6B6B6',
    overflow: 'hidden',
  },
});

export default ThemedInput;
