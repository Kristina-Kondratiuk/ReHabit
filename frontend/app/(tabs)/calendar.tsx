import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, habitColorNames, type HabitColorName } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getHabits } from '@/src/services/habits';
import { getLogs } from '@/src/services/logs';
import { useHabitLogsStore, type HabitLog } from '@/src/store/habit-logs-store';
import { useUserStore } from '@/src/store/user-store';

const monthNames = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

const weekdayLabels = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];
const doneColor = Colors.common.tint;
const unfinishedColor = '#C99BFF';
const calendarMaxWidth = 340;
const calendarPadding = 12;
const calendarBorderWidth = 1;
const dayGap = 6;

type CalendarDay = {
  date: Date;
  day: number;
  inMonth: boolean;
};

type HabitFromApi = {
  _id?: string;
  id?: string;
  title: string;
  color?: string;
  frequency?: string;
  daysOfTheWeek?: number[];
  weeklyDay?: number;
  activeFrom?: string;
  activeTo?: string;
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${year}-${month}`;
};

const getHabitId = (habit: HabitFromApi) => {
  return habit._id ?? habit.id ?? habit.title;
};

const getLogHabitId = (log: HabitLog) => {
  return String(log.habitId);
};

const getApiDateKey = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  if (!value.includes('T')) {
    return value;
  }

  return getDateKey(new Date(value));
};

const parseApiDate = (value: string | undefined) => {
  const dateKey = getApiDateKey(value);

  if (!dateKey) {
    return null;
  }

  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const isHabitColorName = (color: string | undefined): color is HabitColorName => {
  return Boolean(color && habitColorNames.includes(color as HabitColorName));
};

const isHabitScheduledForDate = (habit: HabitFromApi, date: Date) => {
  const currentDate = normalizeDate(date);
  const activeFrom = parseApiDate(habit.activeFrom);
  const activeTo = parseApiDate(habit.activeTo);

  if (activeFrom && activeFrom > currentDate) {
    return false;
  }

  if (activeTo && activeTo < currentDate) {
    return false;
  }

  const currentDay = currentDate.getDay();

  if (habit.frequency === 'weekly') {
    return habit.weeklyDay === currentDay;
  }

  if (habit.frequency === 'custom') {
    return Boolean(habit.daysOfTheWeek?.includes(currentDay));
  }

  return habit.frequency === 'daily' || !habit.frequency;
};

const getMonthDays = (monthDate: Date): CalendarDay[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7;
  const calendarStart = new Date(year, month, 1 - mondayBasedOffset);
  const totalDays = Math.ceil((mondayBasedOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);

    return {
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    };
  });
};

export default function CalendarScreen() {
  const { width } = useWindowDimensions();
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const token = useUserStore((state) => state.token);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [habits, setHabits] = useState<HabitFromApi[]>([]);
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const habitLogs = useHabitLogsStore((state) => state.logs);
  const setMonthLogs = useHabitLogsStore((state) => state.setMonthLogs);
  const replaceLogs = useHabitLogsStore((state) => state.replaceLogs);
  const calendarWidth = Math.min(Math.max(width - 40, 0), calendarMaxWidth);
  const calendarContentWidth = calendarWidth - (calendarPadding + calendarBorderWidth) * 2;
  const daySize = Math.floor((calendarContentWidth - dayGap * 6) / 7);
  const visibleMonthKey = getMonthKey(visibleMonth);

  const days = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);
  const selectedDateKey = getDateKey(selectedDate);
  const completedHabitIdsByDate = useMemo(() => {
    return habitLogs.reduce<Record<string, Set<string>>>((acc, log) => {
      if (log.completed === false) {
        return acc;
      }

      const dateKey = getApiDateKey(log.date);

      if (!dateKey) {
        return acc;
      }

      acc[dateKey] ??= new Set<string>();
      acc[dateKey].add(getLogHabitId(log));

      return acc;
    }, {});
  }, [habitLogs]);

  const getDayCompletionStatus = (date: Date) => {
    const dateKey = getDateKey(date);
    const selectedHabitIdSet = new Set(selectedHabitIds);
    const habitsToCheck = habits.filter((habit) => {
      const isSelected = selectedHabitIdSet.size === 0 || selectedHabitIdSet.has(getHabitId(habit));
      return isSelected && isHabitScheduledForDate(habit, date);
    });

    if (habitsToCheck.length === 0) {
      return 'empty';
    }

    const completedHabitIds = completedHabitIdsByDate[dateKey] ?? new Set<string>();
    const completedCount = habitsToCheck.filter((habit) => completedHabitIds.has(getHabitId(habit))).length;

    if (completedCount === habitsToCheck.length) {
      return 'done';
    }

    if (completedCount > 0) {
      return 'unfinished';
    }

    return 'empty';
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCalendarData = async () => {
        if (!token) {
          setHabits([]);
          replaceLogs([]);
          return;
        }

        setCalendarError(null);

        try {
          const [userHabits, monthLogs] = await Promise.all([
            getHabits(),
            getLogs(visibleMonthKey),
          ]);

          if (isActive) {
            setHabits(Array.isArray(userHabits) ? userHabits : []);
            setMonthLogs(visibleMonthKey, Array.isArray(monthLogs) ? monthLogs : []);
          }
        } catch {
          if (isActive) {
            setCalendarError('Nie udało się pobrać danych kalendarza.');
          }
        }
      };

      void fetchCalendarData();

      return () => {
        isActive = false;
      };
    }, [replaceLogs, setMonthLogs, token, visibleMonthKey])
  );

  const goToMonth = (direction: -1 | 1) => {
    setVisibleMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1);
      return nextMonth;
    });
  };

  const toggleHabitFilter = (habitId: string) => {
    setSelectedHabitIds((currentIds) =>
      currentIds.includes(habitId)
        ? currentIds.filter((selectedHabitId) => selectedHabitId !== habitId)
        : [...currentIds, habitId]
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          Kalendarz
        </ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.habitList}
        style={styles.habitScroller}
      >
        {habits.map((habit) => {
          const habitId = getHabitId(habit);
          const habitColor = isHabitColorName(habit.color) ? habit.color : 'purple';
          const isHabitSelected = selectedHabitIds.includes(habitId);
          const activeHabitColor = Colors.common[habitColor];

          return (
            <Pressable
              key={habitId}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isHabitSelected }}
              onPress={() => toggleHabitFilter(habitId)}
              style={[
                styles.habitChip,
                {
                  backgroundColor: Colors[themeName][habitColor],
                  borderColor: isHabitSelected ? activeHabitColor : 'transparent',
                  shadowColor: activeHabitColor,
                  shadowOpacity: isHabitSelected ? 0.75 : 0,
                  elevation: isHabitSelected ? 4 : 0,
                },
              ]}
            >
              <Text style={[styles.habitText, { color: theme.text }]} numberOfLines={1}>
                {habit.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {calendarError ? (
        <ThemedText style={styles.errorText}>{calendarError}</ThemedText>
      ) : null}

      <View style={styles.monthHeader}>
        <Pressable
          accessibilityRole="button"
          onPress={() => goToMonth(-1)}
          style={styles.monthArrow}
        >
          <ChevronLeft color={Colors.common.white} size={20} strokeWidth={2.5} />
        </Pressable>
        <ThemedText type="defaultSemiBold" style={styles.monthTitle}>
          {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => goToMonth(1)}
          style={styles.monthArrow}
        >
          <ChevronRight color={Colors.common.white} size={20} strokeWidth={2.5} />
        </Pressable>
      </View>

      <View
        style={[
          styles.calendarWrap,
          { width: calendarWidth, borderColor: themeName === 'dark' ? '#232323' : '#EDEDED' },
        ]}
      >
        <View style={styles.weekdays}>
          {weekdayLabels.map((weekday) => (
            <Text key={weekday} style={[styles.weekday, { color: theme.descr }]}>
              {weekday}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {days.map((calendarDay) => {
            const dateKey = getDateKey(calendarDay.date);
            const isSelected = dateKey === selectedDateKey;
            const completionStatus = getDayCompletionStatus(calendarDay.date);
            const isDone = completionStatus === 'done';
            const isUnfinished = completionStatus === 'unfinished';
            const dayBackgroundColor = isDone
              ? doneColor
              : isUnfinished
                ? unfinishedColor
                : theme.background;
            const dayTextColor =
              isDone || isUnfinished ? Colors.common.white : calendarDay.inMonth ? theme.text : theme.descr;

            return (
              <Pressable
                key={dateKey}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedDate(calendarDay.date)}
                style={[
                  styles.dayCell,
                  {
                    width: daySize,
                    height: daySize,
                    backgroundColor: dayBackgroundColor,
                    borderColor: isSelected ? Colors.common.tint : themeName === 'dark' ? '#2A2A2A' : '#EFEFEF',
                    opacity: calendarDay.inMonth ? 1 : 0.45,
                  },
                ]}
              >
                <Text style={[styles.dayText, { color: dayTextColor }]}>{calendarDay.day}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: doneColor }]} />
          <ThemedText style={styles.legendText}>Wykonane</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: unfinishedColor }]} />
          <ThemedText style={styles.legendText}>Niezakończone</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendEmptyDot, { borderColor: theme.descr }]} />
          <ThemedText style={styles.legendText}>Niewykonane</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  title: {
    color: Colors.common.tint,
  },
  habitScroller: {
    flexGrow: 0,
    paddingVertical: 6,
    marginHorizontal: -20,
    marginBottom: 40,
  },
  habitList: {
    gap: 12,
    paddingHorizontal: 20,
  },
  habitChip: {
    height: 34,
    minWidth: 92,
    maxWidth: 150,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  habitText: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '500',
  },
  errorText: {
    color: Colors.common.error,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  monthHeader: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.common.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 16,
  },
  calendarWrap: {
    alignSelf: 'center',
    borderWidth: calendarBorderWidth,
    borderRadius: 12,
    padding: calendarPadding,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayCell: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '500',
  },
  legend: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendEmptyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 9,
    lineHeight: 10,
  },
});
