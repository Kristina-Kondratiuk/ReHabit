import { Modal, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useState } from 'react';

import { Colors, habitColorNames, type HabitColorName } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '../themed-text';

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
  const selectedBackground = Colors[themeName][selectedColor];
  const selectedAccent = Colors.common[selectedColor];
  const selectedShadowStyle = themeName === 'dark'
    ? {
        shadowColor: selectedAccent,
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
            backgroundColor: selectedBackground,
          },
          selectedShadowStyle,
        ]}
      >
        <ThemedText type='defaultSemiBold'>Zmień kolor</ThemedText>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable
            style={[
              styles.modal,
              {
                backgroundColor: themeName === 'dark' ? theme.purple : theme.background,
              },
            ]}
          >
            {habitColorNames.map((color) => {
              const optionBackground = Colors[themeName][color];
              const optionAccent = theme.text;
              const isSelected = selectedColor === color;
              const optionShadowStyle = themeName === 'dark'
                ? {
                    shadowColor: optionAccent,
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
                      backgroundColor: optionBackground,
                    },
                    optionShadowStyle,
                  ]}
                >
                  <ThemedText type='defaultSemiBold'>{colorLabels[color]}</ThemedText>
                  {isSelected ? <Check color={optionAccent} size={18} strokeWidth={2.5} /> : null}
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
    height: 55,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.common.overlay,
  },
  modal: {
    gap: 12,
    borderRadius: 24,
    padding: 20,
  },
  option: {
    minHeight: 55,
    borderRadius: 27,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
});
