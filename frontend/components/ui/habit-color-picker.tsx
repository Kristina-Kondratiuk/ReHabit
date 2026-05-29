import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { useState } from 'react';

import { Colors, getHabitColorTokens, habitColorNames, type HabitColorName } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type HabitColorPickerProps = {
  selectedColor: HabitColorName;
  onSelectColor: (color: HabitColorName) => void;
};

const colorLabels: Record<HabitColorName, string> = {
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  purple: 'Purple',
};

export const HabitColorPicker = ({ selectedColor, onSelectColor }: HabitColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const selectedTokens = getHabitColorTokens(themeName, selectedColor);
  const selectedShadowStyle = themeName === 'dark'
    ? {
        shadowColor: selectedTokens.shadow,
        shadowOpacity: 1,
        elevation: 4,
      }
    : {
        shadowOpacity: 0,
        elevation: 0,
      };

  const handleSelect = (color: HabitColorName) => {
    onSelectColor(color);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: selectedTokens.background,
          },
          selectedShadowStyle,
        ]}
      >
        <Text style={[styles.triggerText, { color: theme.text }]}>Zmień kolor</Text>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable
            style={[
              styles.modal,
              {
                backgroundColor: theme.background,
              },
            ]}
          >
            {habitColorNames.map((color) => {
              const tokens = getHabitColorTokens(themeName, color);
              const isSelected = selectedColor === color;
              const optionShadowStyle = themeName === 'dark'
                ? {
                    shadowColor: tokens.shadow,
                    shadowOpacity: 1,
                    elevation: 3,
                  }
                : {
                    shadowOpacity: 0,
                    elevation: 0,
                  };

              return (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => handleSelect(color)}
                  style={[
                    styles.option,
                    {
                      backgroundColor: tokens.background,
                    },
                    optionShadowStyle,
                  ]}
                >
                  <Text style={[styles.optionText, { color: theme.text }]}>{colorLabels[color]}</Text>
                  {isSelected ? <Check color={tokens.border} size={18} strokeWidth={2.5} /> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: '100%',
    height: 86,
    borderRadius: 43,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  triggerText: {
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modal: {
    gap: 12,
    borderRadius: 24,
    padding: 16,
  },
  option: {
    minHeight: 58,
    borderRadius: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  optionText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
  },
});
