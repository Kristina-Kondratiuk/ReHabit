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
import { Colors, habitColorNames, type HabitColorName } from '@/constants/theme';
import {
  habitIconLabelMap,
  habitIconMap,
  presetHabits,
  type HabitIconName,
} from '@/constants/habit-presets';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createHabit, updateHabit } from '@/src/services/habits';

type HabitType = 'build' | 'quit';
type HabitFrequency = 'daily' | 'weekly' | 'custom';

const frequencyLabels: Record<HabitFrequency, string> = {
  daily: 'Codziennie',
  weekly: 'Raz w tygodniu',
  custom: 'Wybrane dni',
};

const weekdayOptions = [
  { label: 'Nd', value: 0 },
  { label: 'Pn', value: 1 },
  { label: 'Wt', value: 2 },
  { label: 'Śr', value: 3 },
  { label: 'Cz', value: 4 },
  { label: 'Pt', value: 5 },
  { label: 'Sb', value: 6 },
] as const;

type AddHabitParams = {
  presetId?: string;
  habitId?: string;
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  type?: string;
  frequency?: string;
  daysOfTheWeek?: string;
  weeklyDay?: string;
  activeFrom?: string;
  activeTo?: string;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Nie udało się dodać nawyku.';
};

const isHabitIconName = (icon: string | undefined): icon is HabitIconName => {
  return Boolean(icon && icon in habitIconMap);
};

const isHabitColorName = (color: string | undefined): color is HabitColorName => {
  return Boolean(color && habitColorNames.includes(color as HabitColorName));
};

const isHabitType = (value: string | undefined): value is HabitType => {
  return value === 'build' || value === 'quit';
};

const isHabitFrequency = (value: string | undefined): value is HabitFrequency => {
  return value === 'daily' || value === 'weekly' || value === 'custom';
};

const normalizeDateParam = (value: string | undefined) => {
  return value ? value.split('T')[0] : null;
};

const parseDaysOfTheWeek = (value: string | undefined) => {
  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((day): day is number => typeof day === 'number' && day >= 0 && day <= 6);
  } catch {
    return [];
  }
};

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
  const {
    presetId,
    habitId,
    title: habitTitle,
    description: habitDescription,
    icon: habitIcon,
    color: habitColor,
    type: habitTypeParam,
    frequency: habitFrequency,
    daysOfTheWeek,
    weeklyDay,
    activeFrom,
    activeTo,
  } = useLocalSearchParams<AddHabitParams>();
  const preset = useMemo(() => presetHabits.find((item) => item.id === presetId), [presetId]);
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const isEditing = Boolean(habitId);
  const parsedDaysOfTheWeek = parseDaysOfTheWeek(daysOfTheWeek);
  const parsedWeeklyDay = weeklyDay ? Number(weeklyDay) : undefined;
  const initialFrequency = isHabitFrequency(habitFrequency) ? habitFrequency : 'daily';
  const initialWeekDays =
    initialFrequency === 'custom' && parsedDaysOfTheWeek.length > 0
      ? parsedDaysOfTheWeek
      : initialFrequency === 'weekly' && parsedWeeklyDay !== undefined && parsedWeeklyDay >= 0 && parsedWeeklyDay <= 6
        ? [parsedWeeklyDay]
        : [new Date().getDay()];

  const [selectedColor, setSelectedColor] = useState<HabitColorName>(
    isHabitColorName(habitColor) ? habitColor : 'blue'
  );
  const [selectedIcon, setSelectedIcon] = useState<HabitIconName>(
    isHabitIconName(habitIcon) ? habitIcon : preset?.icon ?? 'droplet'
  );
  const [title, setTitle] = useState(habitTitle ?? preset?.title ?? '');
  const [description, setDescription] = useState(habitDescription ?? preset?.description ?? '');
  const [habitType, setHabitType] = useState<HabitType>(
    isHabitType(habitTypeParam)
      ? habitTypeParam
      : preset?.id === 'alcohol-free' || preset?.id === 'smoking'
        ? 'quit'
        : 'build'
  );
  const [frequency, setFrequency] = useState<HabitFrequency>(initialFrequency);
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>(initialWeekDays);
  const [isFrequencyPickerOpen, setIsFrequencyPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(normalizeDateParam(activeFrom));
  const [endDate, setEndDate] = useState<string | null>(normalizeDateParam(activeTo));
  const [draftStartDate, setDraftStartDate] = useState<string | null>(null);
  const [draftEndDate, setDraftEndDate] = useState<string | null>(null);

  const iconOptions: HabitIconOption[] = (Object.keys(habitIconLabelMap) as HabitIconName[]).map((id) => ({
    id,
    label: habitIconLabelMap[id],
    Icon: habitIconMap[id],
  }));

  const markedDates = useMemo(() => buildMarkedRange(draftStartDate, draftEndDate, themeName), [draftEndDate, draftStartDate, themeName]);
  const isRangeSelected = Boolean(draftStartDate && draftEndDate);
  const isConfirmDisabled = !isRangeSelected;

  const handleSubmit = async () => {
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const activeFrom = startDate;

    if (!normalizedTitle) {
      Alert.alert('Brak nazwy', 'Wpisz nazwę nawyku.');
      return;
    }

    if (!activeFrom) {
      Alert.alert('Brak zakresu dat', 'Wybierz zakres dat.');
      return;
    }

    if (frequency === 'custom' && selectedWeekDays.length === 0) {
      Alert.alert('Brak dni', 'Wybierz dni tygodnia dla tego nawyku.');
      return;
    }

    setIsSubmitting(true);

    try {
      const habitPayload = {
        title: normalizedTitle,
        description: normalizedDescription,
        icon: selectedIcon,
        color: selectedColor,
        type: habitType,
        frequency,
        daysOfTheWeek: frequency === 'custom' ? [...selectedWeekDays].sort((a, b) => a - b) : [],
        weeklyDay: frequency === 'weekly' ? selectedWeekDays[0] : undefined,
        activeFrom,
        activeTo: endDate,
      };

      if (isEditing && habitId) {
        await updateHabit(habitId, habitPayload);
        router.replace('/(tabs)');
      } else {
        await createHabit(habitPayload);
        router.replace('/(tabs)/addHabit');
      }
    } catch (error) {
      Alert.alert('Błąd', getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDateRangePicker = () => {
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setIsDatePickerOpen(true);
  };

  const handleRangeDayPress = (day: DateData) => {
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
    if (!draftStartDate) {
      setIsDatePickerOpen(false);
      return;
    }

    setStartDate(draftStartDate);
    setEndDate(draftEndDate ?? draftStartDate);
    setIsDatePickerOpen(false);
  };

  const handleSelectFrequency = (nextFrequency: HabitFrequency) => {
    setFrequency(nextFrequency);
    setIsFrequencyPickerOpen(false);
  };

  const handleSelectWeekday = (day: number) => {
    if (frequency === 'weekly') {
      setSelectedWeekDays([day]);
      return;
    }

    setSelectedWeekDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day].sort((a, b) => a - b)
    );
  };

  const rangeFieldLabel =
    startDate && endDate
      ? `Od: ${formatUiDate(startDate)}    Do: ${formatUiDate(endDate)}`
      : 'Wybierz zakres dat';
  const isRangePicked = Boolean(startDate && endDate);
  const shouldShowWeekdayPicker = frequency === 'weekly' || frequency === 'custom';

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
          {isEditing ? 'Edytuj nawyk' : 'Dodaj nowy nawyk'}
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
                style={{ color: isRangePicked ? theme.text : theme.icon }}
              >
                {rangeFieldLabel}
              </ThemedText>
            </Pressable>
          </View>

          <Pressable style={styles.dropdownLike} onPress={() => setIsFrequencyPickerOpen(true)}>
            <ThemedText type="defaultSemiBold">{frequencyLabels[frequency]}</ThemedText>
            <ChevronDown color={theme.descr} size={18} />
          </Pressable>

          {shouldShowWeekdayPicker ? (
            <View style={styles.weekdaySection}>
              <ThemedText type="defaultSemiBold">
                {frequency === 'weekly' ? 'Dzień tygodnia' : 'Dni tygodnia'}
              </ThemedText>
              <View style={styles.weekdayRow}>
                {weekdayOptions.map((day) => {
                  const isSelected = selectedWeekDays.includes(day.value);

                  return (
                    <Pressable
                      key={day.value}
                      style={[
                        styles.weekdayChip,
                        { borderColor: isSelected ? Colors.common.tint : Colors.common.inputBorder },
                        isSelected ? { backgroundColor: theme.purple } : null,
                      ]}
                      onPress={() => handleSelectWeekday(day.value)}
                    >
                      <ThemedText
                        type="defaultSemiBold"
                        style={[styles.weekdayText, { color: isSelected ? Colors.common.tint : theme.text }]}
                      >
                        {day.label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.typeRow}>
            <ThemedButton
              title="Nabywam"
              variant="choice"
              tone="green"
              width={'48%'}
              selected={habitType === 'build'}
              onPress={() => setHabitType('build')}
            />
            <ThemedButton
              title="Pozbywam się"
              variant="choice"
              tone="red"
              width={'48%'}
              selected={habitType === 'quit'}
              onPress={() => setHabitType('quit')}
            />
          </View>

          <ThemedButton
            title={isSubmitting ? (isEditing ? 'Zapisywanie...' : 'Dodawanie...') : isEditing ? 'Zapisać' : 'Dodać'}
            onPress={handleSubmit}
            height={52}
            disabled={isSubmitting}
          />
        </View>
      </KeyboardAwareScrollView>

      <BottomSheetModal
        visible={isDatePickerOpen}
        title="Wybierz zakres dat"
        onClose={() => setIsDatePickerOpen(false)}
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

      <BottomSheetModal
        visible={isFrequencyPickerOpen}
        title="Okresowość"
        onClose={() => setIsFrequencyPickerOpen(false)}
      >
        {(Object.keys(frequencyLabels) as HabitFrequency[]).map((option) => {
          const isSelected = frequency === option;

          return (
            <Pressable
              key={option}
              style={[
                styles.frequencyOption,
                {
                  borderColor: isSelected ? Colors.common.tint : Colors.common.inputBorder,
                  backgroundColor: isSelected ? theme.purple : 'transparent',
                },
              ]}
              onPress={() => handleSelectFrequency(option)}
            >
              <ThemedText type="defaultSemiBold">{frequencyLabels[option]}</ThemedText>
            </Pressable>
          );
        })}
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
  frequencyOption: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 11,
    justifyContent: 'center',
    paddingHorizontal: 14,
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
  weekdayChip: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weekdaySection: {
    gap: 10,
  },
  weekdayText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
