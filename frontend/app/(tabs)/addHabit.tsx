import { StyleSheet } from 'react-native';
import React, { useState } from 'react';

import { ThemedView } from '@/components/themed-view';
import { HabitColorPicker } from '@/components/ui/habit-color-picker';
import type { HabitColorName } from '@/constants/theme';

const AddHabit = () => {
  const [selectedColor, setSelectedColor] = useState<HabitColorName>('green');

  return (
    <ThemedView style={styles.container}>
      <HabitColorPicker selectedColor={selectedColor} onSelectColor={setSelectedColor} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
  },
});

export default AddHabit;
