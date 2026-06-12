import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ProfileMenuButtonProps = {
  icon: React.ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
  title: string;
  danger?: boolean;
  onPress: () => void;
};

export function ProfileMenuButton({
  icon: Icon,
  title,
  danger = false,
  onPress,
}: ProfileMenuButtonProps) {
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const accentColor = danger ? Colors.common.error : Colors.common.tint;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: theme.background,
          borderColor: accentColor,
        },
      ]}
    >
      <View style={[styles.iconWrap, { borderColor: accentColor }]}>
        <Icon color={accentColor} size={18} strokeWidth={1.7} />
      </View>
      <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      <ChevronRight color={accentColor} size={22} strokeWidth={1.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
});
