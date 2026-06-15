import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getStatistics } from '@/src/services/statistics';
import { useUserStore } from '@/src/store/user-store';

type DailyCompletedHabit = {
  date: string;
  count: number;
};

type StatisticsData = {
  currentStreak?: number;
  longestStreak?: number;
  completionRate?: number;
  dailyCompletedHabits?: DailyCompletedHabit[];
};

type ChartDay = DailyCompletedHabit & {
  label: string;
};

const chartMaxBars = 7;

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getDateLabel = (date: Date) => {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${day}.${month}`;
};

const getLastSevenDays = (dailyCompletedHabits: DailyCompletedHabit[]): ChartDay[] => {
  const completedByDate = dailyCompletedHabits.reduce<Record<string, number>>((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {});
  const today = new Date();

  return Array.from({ length: chartMaxBars }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (chartMaxBars - 1 - index));
    const dateKey = getDateKey(date);

    return {
      date: dateKey,
      label: getDateLabel(date),
      count: completedByDate[dateKey] ?? 0,
    };
  });
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Nie udało się pobrać statystyk.';
};

export default function StatisticsScreen() {
  const { width } = useWindowDimensions();
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const token = useUserStore((state) => state.token);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statisticsError, setStatisticsError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchStatistics = async () => {
        if (!token) {
          setStatistics(null);
          return;
        }

        setIsLoading(true);
        setStatisticsError(null);

        try {
          const data = await getStatistics();

          if (isActive) {
            setStatistics(data ?? null);
          }
        } catch (error) {
          if (isActive) {
            setStatisticsError(getErrorMessage(error));
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      void fetchStatistics();

      return () => {
        isActive = false;
      };
    }, [token])
  );

  const dailyCompletedHabits = useMemo(
    () => statistics?.dailyCompletedHabits ?? [],
    [statistics?.dailyCompletedHabits]
  );
  const chartDays = useMemo(() => getLastSevenDays(dailyCompletedHabits), [dailyCompletedHabits]);
  const totalCompletedHabits = dailyCompletedHabits.reduce((sum, item) => sum + item.count, 0);
  const totalCompletedDays = dailyCompletedHabits.filter((item) => item.count > 0).length;
  const chartWidth = Math.max(width - 76, 260);
  const chartConfig = {
    backgroundGradientFrom: theme.background,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: theme.background,
    backgroundGradientToOpacity: 1,
    decimalPlaces: 0,
    color: () => Colors.common.tint,
    labelColor: () => theme.descr,
    fillShadowGradient: Colors.common.tint,
    fillShadowGradientOpacity: themeName === 'dark' ? 0.9 : 0.75,
    barPercentage: 0.62,
    propsForBackgroundLines: {
      stroke: 'transparent',
    },
    propsForLabels: {
      fontFamily: 'Inter',
      fontSize: 12,
    },
  };
  const chartData = {
    labels: chartDays.map((item) => item.label),
    datasets: [
      {
        data: chartDays.map((item) => item.count),
      },
    ],
  };
  const statCards = [
    {
      value: `${statistics?.longestStreak ?? 0} dni`,
      label: 'Rekordowa liczba',
    },
    {
      value: `${statistics?.completionRate ?? 0}%`,
      label: 'Wskaźnik realizacji',
    },
    {
      value: `${totalCompletedHabits}`,
      label: 'Wykonanych nawyków',
    },
    {
      value: `${totalCompletedDays} dni`,
      label: 'Łączna liczba',
    },
  ];

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            Statystyka
          </ThemedText>
        </View>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color={Colors.common.tint} />
          </View>
        ) : null}

        {statisticsError ? (
          <ThemedText type="defaultSemiBold" style={styles.errorText}>
            {statisticsError}
          </ThemedText>
        ) : null}

        <View style={styles.statsGrid}>
          {statCards.map((card) => (
            <View
              key={card.label}
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.background,
                  borderColor: themeName === 'dark' ? '#3A244F' : '#E8D7FF',
                },
              ]}
            >
              <Text style={[styles.statValue, { color: theme.text }]}>{card.value}</Text>
              <Text style={[styles.statLabel, { color: theme.descr }]}>{card.label}</Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: theme.background,
              borderColor: themeName === 'dark' ? '#3A244F' : '#E8D7FF',
            },
          ]}
        >
          <Text style={[styles.chartTitle, { color: theme.text }]}>Wykonane nawyki</Text>
          <View style={styles.chartWrap}>
            <BarChart
              data={chartData}
              width={chartWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              fromZero
              showBarTops={false}
              withInnerLines={false}
              withVerticalLabels
              withHorizontalLabels
              segments={7}
              style={styles.chart}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 112,
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
  loadingState: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.common.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    width: '48.4%',
    minHeight: 76,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: Colors.common.tint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Inter',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  statLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '400',
  },
  chartCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    shadowColor: Colors.common.tint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  chartTitle: {
    fontFamily: 'Inter',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  chartWrap: {
    alignItems: 'center',
    overflow: 'visible',
  },
  chart: {
    borderRadius: 12,
  },
});
