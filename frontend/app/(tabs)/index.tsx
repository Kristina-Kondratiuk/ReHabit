import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { Colors, habitColorNames, type HabitColorName } from "@/constants/theme";
import HabitToday from "@/components/habit-comp";
import { ThemedView } from "@/components/themed-view";
import { HorizontalCalendar } from "@/components/ui/horizontal-calendar";
import { useUserStore } from "@/src/store/user-store";
import { deleteHabit, getHabits } from "@/src/services/habits";
import { completeHabitForDate, getLogs, uncompleteHabitForDate } from "@/src/services/logs";
import {
  habitIconMap,
  type HabitIconName,
} from "@/constants/habit-presets";

type HabitFromApi = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  type?: string;
  frequency?: string;
  daysOfTheWeek?: number[];
  weeklyDay?: number;
  activeFrom?: string;
  activeTo?: string;
};

type HabitLogFromApi = {
  _id?: string;
  habitId: string;
  date: string;
  completed?: boolean;
};

const isHabitIconName = (icon: string | undefined): icon is HabitIconName => {
  return Boolean(icon && icon in habitIconMap);
};

const isHabitColorName = (color: string | undefined): color is HabitColorName => {
  return Boolean(color && habitColorNames.includes(color as HabitColorName));
};

const getFirstName = (value: string | undefined) => {
  return value?.trim().split(/\s+/)[0];
};

const toDateParam = (value: string | undefined) => {
  return value?.split('T')[0];
};

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toMonthString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${year}-${month}`;
};

const parseDateString = (value: string | undefined) => {
  const dateString = toDateParam(value);

  if (!dateString) {
    return null;
  }

  const [year, month, day] = dateString.split('-').map(Number);

  return new Date(year, month - 1, day);
};

const isHabitScheduledForDate = (habit: HabitFromApi, date: Date) => {
  const currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);

  const activeFrom = parseDateString(habit.activeFrom);
  const activeTo = parseDateString(habit.activeTo);

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

const isLogForDate = (log: HabitLogFromApi, dateString: string) => {
  return toDateParam(log.date) === dateString;
};


export default function HomeScreen() {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [habits, setHabits] = useState<HabitFromApi[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLogFromApi[]>([]);
  const [updatingCompletionKeys, setUpdatingCompletionKeys] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isLoadingHabits, setIsLoadingHabits] = useState(false);
  const [habitsError, setHabitsError] = useState<string | null>(null);
  const greetingName = getFirstName(user?.username) || getFirstName(user?.email?.split('@')[0]);
  const selectedDateString = toDateString(selectedDate);
  const selectedMonthString = toMonthString(selectedDate);

  const visibleHabits =
    !isLoadingHabits && !habitsError
      ? habits.filter((habit) => isHabitScheduledForDate(habit, selectedDate))
      : [];
  const completedHabitIds = new Set(
    habitLogs
      .filter((log) => log.completed !== false && isLogForDate(log, selectedDateString))
      .map((log) => String(log.habitId))
  );

  const handleEditHabit = (habit: HabitFromApi) => {
    const habitId = habit._id ?? habit.id;

    if (!habitId) {
      return;
    }

    router.push({
      pathname: '/(tabs)/addHabit/create',
      params: {
        habitId,
        title: habit.title,
        description: habit.description ?? '',
        icon: habit.icon ?? '',
        color: habit.color ?? '',
        type: habit.type ?? '',
        frequency: habit.frequency ?? '',
        daysOfTheWeek: JSON.stringify(habit.daysOfTheWeek ?? []),
        weeklyDay: habit.weeklyDay !== undefined ? String(habit.weeklyDay) : '',
        activeFrom: toDateParam(habit.activeFrom) ?? '',
        activeTo: toDateParam(habit.activeTo) ?? '',
      },
    });
  };

  const handleDeleteHabit = (habit: HabitFromApi) => {
    const habitId = habit._id ?? habit.id;

    if (!habitId) {
      return;
    }

    Alert.alert('Usunąć nawyk?', 'Tej operacji nie można cofnąć.', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteHabit(habitId);
            setHabits((currentHabits) =>
              currentHabits.filter((currentHabit) => (currentHabit._id ?? currentHabit.id) !== habitId)
            );
            setHabitLogs((currentLogs) => currentLogs.filter((log) => String(log.habitId) !== habitId));
          } catch {
            Alert.alert('Błąd', 'Nie udało się usunąć nawyku.');
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchDashboardData = async () => {
        if (!token) {
          setHabits([]);
          setHabitLogs([]);
          return;
        }

        setIsLoadingHabits(true);
        setHabitsError(null);

        try {
          const [userHabits, monthLogs] = await Promise.all([
            getHabits(),
            getLogs(selectedMonthString),
          ]);

          if (isActive) {
            setHabits(Array.isArray(userHabits) ? userHabits : []);
            setHabitLogs(Array.isArray(monthLogs) ? monthLogs : []);
          }
        } catch {
          if (isActive) {
            setHabitsError("Nie udało się pobrać nawyków.");
          }
        } finally {
          if (isActive) {
            setIsLoadingHabits(false);
          }
        }
      };

      void fetchDashboardData();

      return () => {
        isActive = false;
      };
    }, [selectedMonthString, token])
  );

  const handleToggleComplete = async (habit: HabitFromApi, nextChecked: boolean) => {
    const habitId = habit._id ?? habit.id;

    if (!habitId) {
      return;
    }

    const completionKey = `${habitId}-${selectedDateString}`;
    const previousLogs = habitLogs;

    setUpdatingCompletionKeys((currentKeys) => [...currentKeys, completionKey]);
    setHabitLogs((currentLogs) => {
      const logsWithoutSelected = currentLogs.filter(
        (log) => !(String(log.habitId) === habitId && isLogForDate(log, selectedDateString))
      );

      if (!nextChecked) {
        return logsWithoutSelected;
      }

      return [
        ...logsWithoutSelected,
        {
          habitId,
          date: selectedDateString,
          completed: true,
        },
      ];
    });

    try {
      const updatedLog = nextChecked
        ? await completeHabitForDate(habitId, selectedDateString)
        : await uncompleteHabitForDate(habitId, selectedDateString);

      if (nextChecked) {
        setHabitLogs((currentLogs) => {
          const logsWithoutSelected = currentLogs.filter(
            (log) => !(String(log.habitId) === habitId && isLogForDate(log, selectedDateString))
          );

          return [...logsWithoutSelected, updatedLog];
        });
      }
    } catch {
      setHabitLogs(previousLogs);
      Alert.alert('Błąd', 'Nie udało się zapisać wykonania nawyku.');
    } finally {
      setUpdatingCompletionKeys((currentKeys) => currentKeys.filter((key) => key !== completionKey));
    }
  };

  const renderHabit = ({ item: habit }: { item: HabitFromApi }) => {
    const habitId = habit._id ?? habit.id ?? habit.title;
    const iconName = isHabitIconName(habit.icon) ? habit.icon : 'droplet';
    const Icon = habitIconMap[iconName];
    const color = isHabitColorName(habit.color) ? habit.color : 'purple';
    const completionKey = `${habitId}-${selectedDateString}`;

    return (
      <HabitToday
        title={habit.title}
        description={habit.description}
        icon={<Icon size={28} strokeWidth={1.5} />}
        color={color}
        completed={completedHabitIds.has(habitId)}
        isCompletionUpdating={updatingCompletionKeys.includes(completionKey)}
        onToggleComplete={(nextChecked) => handleToggleComplete(habit, nextChecked)}
        onEdit={() => handleEditHabit(habit)}
        onDelete={() => handleDeleteHabit(habit)}
      />
    );
  };

  const renderEmptyList = () => {
    if (isLoadingHabits) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="small" color={Colors.common.tint} />
        </View>
      );
    }

    if (habitsError) {
      return (
        <View style={styles.emptyState}>
          <ThemedText type="defaultSemiBold" style={styles.emptyStateText}>
            {habitsError}
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <ThemedText type="defaultSemiBold" style={styles.emptyStateText}>
          Brak zadań na wybrany dzień.
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <ThemedText type="subtitle" style={styles.headerText}>
        {greetingName ? `Cześć, ${greetingName}!` : 'Cześć!'}
      </ThemedText>
      <HorizontalCalendar onDateChange={setSelectedDate} />
      <ThemedText type="defaultSemiBold">Zadania na dziś</ThemedText>
      <FlatList
        data={visibleHabits}
        renderItem={renderHabit}
        keyExtractor={(habit) => habit._id ?? habit.id ?? habit.title}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.habitList}
        extraData={`${selectedDateString}-${habitLogs.length}-${updatingCompletionKeys.length}`}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        style={styles.habitScroller}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bell: {
    borderRadius: 70,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: Colors.common.tint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  btn: {
    borderRadius: 20,
    width: 28,
    height: 28,
  },
  headerText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: Colors.common.textSecondary,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  habitList: {
    flexGrow: 1,
    gap: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  mainContainer: {
    gap: 20,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    height: "100%",
  },
  habitScroller: {
    flex: 1,
    overflow: 'hidden',
  },
  stateContainer: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateText: {
    color: Colors.common.textSecondary,
  },
  titleContainer: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#B4D3D9",
    borderRadius: 20,
    padding: 18,
  },
  choiceButtonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  choiceButtonWrap: {
    flex: 1,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
