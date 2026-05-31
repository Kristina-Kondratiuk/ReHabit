import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { type LucideIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type HabitIconOption = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

type HabitIconPickerProps = {
  selectedIconId: string;
  onSelectIcon: (iconId: string) => void;
  options: HabitIconOption[];
};

export const HabitIconPicker = ({ selectedIconId, onSelectIcon, options }: HabitIconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];

  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedIconId) ?? options[0],
    [options, selectedIconId]
  );

  const SelectedIcon = selectedOption?.Icon;

  const handleSelect = (iconId: string) => {
    onSelectIcon(iconId);
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
            backgroundColor: theme.background,
            borderColor: Colors.common.tint,
          },
        ]}
      >
        <View style={styles.triggerLeft}>
          {SelectedIcon ? <SelectedIcon color={theme.text} size={27} strokeWidth={1.5} /> : null}
        </View>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable style={[styles.modal, { backgroundColor: theme.purple}]}>
            <View style={styles.grid}>
              {options.map((option) => {
                const isSelected = selectedIconId === option.id;

                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => handleSelect(option.id)}
                    style={[
                      styles.option,
                      {
                        borderColor: isSelected ? Colors.common.tint : '#E5E7EB',
                        backgroundColor: isSelected ? Colors[themeName].purple : theme.background,
                      },
                    ]}
                  >
                    <option.Icon color={theme.text} size={22} strokeWidth={1.9} />
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    columnGap: 10,
    rowGap: 10,
  },
  modal: {
    gap: 10,
    borderRadius: 24,
    padding: 16,
    width: 258,
    alignSelf: 'center',
  },
  option: {
    width: 49,
    height: 49,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.common.overlay,
  },
  trigger: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerLeft: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
  },
});
