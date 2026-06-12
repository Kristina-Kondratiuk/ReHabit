import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar, type DateData } from 'react-native-calendars';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ThemedInput from '@/components/ui/ThemedInput';
import { ThemedButton } from '@/components/ui/ThemedButton';
import BottomSheetModal from '@/components/ui/bottom-sheet-modal';
import { HabitColorPicker } from '@/components/ui/habit-color-picker';
import { HabitIconPicker, type HabitIconOption } from '@/components/ui/habit-icon-picker';
import { Colors, type HabitColorName } from '@/constants/theme';
import {
  habitIconLabelMap,
  habitIconMap,
  presetHabits,
  type HabitIconName,
} from '@/constants/habit-presets';
import { useColorScheme } from '@/hooks/use-color-scheme';

const parseDateString = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatUiDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};

const buildMarkedRange = (start: string | null, end: string | null, themeName: 'light' | 'dark') => {
  if (!start) {
    return {};
  }

  const finalEnd = end ?? start;
  const startDate = parseDateString(start);
  const endDate = parseDateString(finalEnd);
  const minDate = startDate <= endDate ? startDate : endDate;
  const maxDate = startDate <= endDate ? endDate : startDate;

  const marks: Record<string, { startingDay: boolean; endingDay: boolean; color: string; textColor: string }> = {};
  const cursor = new Date(minDate);

  while (cursor <= maxDate) {
    const key = toDateString(cursor);
    marks[key] = {
      startingDay: key === toDateString(minDate),
      endingDay: key === toDateString(maxDate),
      color: Colors.common.tint,
      textColor: themeName === 'dark' ? Colors.common.white : Colors.common.black,
    };

    cursor.setDate(cursor.getDate() + 1);
  }

  return marks;
};

export default function AddHabitCreateScreen() {
  const { presetId } = useLocalSearchParams<{ presetId?: string }>();
  const preset = useMemo(() => presetHabits.find((item) => item.id === presetId), [presetId]);
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];

  const [selectedColor, setSelectedColor] = useState<HabitColorName>('blue');
  const [selectedIcon, setSelectedIcon] = useState<HabitIconName>(preset?.icon ?? 'droplet');
  const [title, setTitle] = useState(preset?.title ?? '');
  const [description, setDescription] = useState(preset?.description ?? '');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isIndefinite, setIsIndefinite] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [draftStartDate, setDraftStartDate] = useState<string | null>(null);
  const [draftEndDate, setDraftEndDate] = useState<string | null>(null);
  const [isDraftIndefinite, setIsDraftIndefinite] = useState(false);

  const iconOptions: HabitIconOption[] = (Object.keys(habitIconLabelMap) as HabitIconName[]).map((id) => ({
    id,
    label: habitIconLabelMap[id],
    Icon: habitIconMap[id],
  }));

  const markedDates = useMemo(() => buildMarkedRange(draftStartDate, draftEndDate, themeName), [draftEndDate, draftStartDate, themeName]);
  const isRangeSelected = Boolean(draftStartDate && draftEndDate);
  const isConfirmDisabled = !isRangeSelected && !isDraftIndefinite;

  const handleSubmit = () => {
    Alert.alert('Info', 'Coming soon...');
  };

  const openDateRangePicker = () => {
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setIsDraftIndefinite(isIndefinite);
    setIsDatePickerOpen(true);
  };

  const handleRangeDayPress = (day: DateData) => {
    setIsDraftIndefinite(false);
    const pickedDate = day.dateString;

    if (!draftStartDate || (draftStartDate && draftEndDate)) {
      setDraftStartDate(pickedDate);
      setDraftEndDate(null);
      return;
    }

    if (pickedDate < draftStartDate) {
      setDraftEndDate(draftStartDate);
      setDraftStartDate(pickedDate);
      return;
    }

    setDraftEndDate(pickedDate);
  };

  const confirmDateRange = () => {
    if (isDraftIndefinite) {
      setIsIndefinite(true);
      setStartDate(null);
      setEndDate(null);
      setIsDatePickerOpen(false);
      return;
    }

    if (!draftStartDate) {
      setIsDatePickerOpen(false);
      return;
    }

    setIsIndefinite(false);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate ?? draftStartDate);
    setIsDatePickerOpen(false);
  };

  const toggleIndefinite = () => {
    setIsDraftIndefinite((prev) => !prev);
    setDraftStartDate(null);
    setDraftEndDate(null);
  };

  const rangeFieldLabel =
    isIndefinite
      ? 'Bezterminowo'
      : startDate && endDate
        ? `Od: ${formatUiDate(startDate)}    Do: ${formatUiDate(endDate)}`
        : 'Wybierz zakres dat';
  const isRangePicked = isIndefinite || Boolean(startDate && endDate);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        enableOnAndroid
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.back} onPress={() => router.back()}>
          <ArrowLeft color={Colors.common.tint} size={30} strokeWidth={1.8} />
        </Pressable>

        <ThemedText style={styles.titleText} type="subtitle">
          Dodaj nowy nawyk
        </ThemedText>

        <View style={styles.formSection}>
          <View style={styles.controlRow}>
            <HabitIconPicker
              selectedIconId={selectedIcon}
              onSelectIcon={(iconId) => setSelectedIcon(iconId as HabitIconName)}
              options={iconOptions}
            />
            <View style={styles.colorPickerWrap}>
              <HabitColorPicker selectedColor={selectedColor} onSelectColor={setSelectedColor} />
            </View>
          </View>

          <ThemedInput placeholder="Nazwa" value={title} onChangeText={setTitle} />
          <ThemedInput
            placeholder="Opis..."
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.descriptionInput}
            textAlignVertical="top"
          />

          <View>
            <ThemedText type="defaultSemiBold">Ustaw zakres dat:</ThemedText>
            <Pressable style={styles.rangeButton} onPress={openDateRangePicker}>
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: 15, fontWeight: 500, color: isRangePicked ? Colors.common.black : theme.icon }}
              >
                {rangeFieldLabel}
              </ThemedText>
            </Pressable>
          </View>

          <Pressable style={styles.dropdownLike}>
            <ThemedText>Okresowość</ThemedText>
            <ChevronDown color={theme.descr} size={18} />
          </Pressable>

          <View style={styles.typeRow}>
            <ThemedButton title="Nabywam" variant="choice" tone="green" width={'48%'} selected />
            <ThemedButton title="Pozbywam się" variant="choice" tone="red" width={'48%'} />
          </View>

          <ThemedButton title="Dodać" onPress={handleSubmit} height={52} />
        </View>
      </KeyboardAwareScrollView>

      <BottomSheetModal
        visible={isDatePickerOpen}
        title="Wybierz zakres dat"
        onClose={() => setIsDatePickerOpen(false)}
        rightActionLabel="Bezterminowo"
        onRightActionPress={toggleIndefinite}
        isRightActionActive={isDraftIndefinite}
      >
          <View style={styles.calendarWrap}>
            <Calendar
              current={draftStartDate ?? startDate ?? toDateString(new Date())}
              markingType="period"
              markedDates={markedDates}
              onDayPress={handleRangeDayPress}
              enableSwipeMonths
              theme={{
                calendarBackground: theme.background,
                textSectionTitleColor: theme.descr,
                dayTextColor: theme.text,
                monthTextColor: theme.text,
                arrowColor: Colors.common.tint,
                selectedDayTextColor: Colors.common.white,
                textDisabledColor: theme.descr,
                todayTextColor: Colors.common.tint,
                textDayFontSize: 15,
                textMonthFontSize: 20,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>

        <ThemedButton title="Potwierdź zakres" onPress={confirmDateRange} height={52} disabled={isConfirmDisabled} />
      </BottomSheetModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  back: {
    width: 38,
    marginBottom: 24,
  },
  colorPickerWrap: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 24,
  },
  calendarWrap: {
    width: '100%',
  },
  calendarScaleWrap: {
    width: '92%',
    alignSelf: 'center',
    transform: [{ scale: 0.88 }],
    marginVertical: -14,
  },
  controlRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  descriptionInput: {
    height: 140,
    alignItems: 'flex-start',
  },
  dropdownLike: {
    borderWidth: 1,
    borderColor: '#CFCFCF',
    borderRadius: 11,
    height: 56,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formSection: {
    gap: 16,
  },
  rangeButton: {
    borderWidth: 2,
    borderColor: '#CFCFCF',
    borderRadius: 11,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginTop: 10,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleText: {
    marginBottom: 18,
  },
  typeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
});
