import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CalendarProvider, WeekCalendar, type DateData } from 'react-native-calendars';
import { useMemo, useState } from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const weekdayLabels = ['pon', 'wt', 'śr', 'czw', 'pt', 'sob', 'niedz'];
const screenHorizontalPadding = 20;
const dayGap = 8;
const daysInWeek = 7;
const dayHeight = 70;
const calendarHeight = dayHeight;

const formatDateForCalendar = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

type CalendarDayProps = {
  date?: DateData;
  selected?: boolean;
  dayWidth: number;
  onPress?: (date?: DateData) => void;
};

type HorizontalCalendarProps = {
  onDateChange?: (date: Date) => void;
};

const CalendarDay = ({ date, selected = false, dayWidth, onPress }: CalendarDayProps) => {
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const weekdayIndex = date ? new Date(date.timestamp).getDay() : 1;
  const weekday = date ? weekdayLabels[weekdayIndex === 0 ? 6 : weekdayIndex - 1] : '';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => onPress?.(date)}
      style={[
        styles.day,
        {
          borderColor: theme.tint,
          backgroundColor: theme.background,
          width: dayWidth,
        },
      ]}
    >
      <Text style={[styles.dayNumber, { color: theme.text }]}>{date?.day}</Text>
      <Text style={[styles.weekday, { color: theme.text }]}>{weekday}</Text>
      {selected ? <View style={[styles.dot, { backgroundColor: theme.tint }]} /> : null}
    </Pressable>
  );
};

export const HorizontalCalendar = ({ onDateChange }: HorizontalCalendarProps) => {
  const { width } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const selectedDateString = formatDateForCalendar(selectedDate);
  const calendarWidth = Math.max(0, width - screenHorizontalPadding * 2);
  const dayWidth = Math.max(40, (calendarWidth - dayGap * (daysInWeek - 1)) / daysInWeek);
  const markedDates = useMemo(
    () => ({
      [selectedDateString]: {
        selected: true,
      },
    }),
    [selectedDateString],
  );
  const calendarTheme = useMemo(
    () => ({
      backgroundColor: 'transparent',
      calendarBackground: 'transparent',
      textSectionTitleColor: 'transparent',
      dayTextColor: theme.text,
      todayTextColor: theme.tint,
      selectedDayTextColor: theme.text,
      selectedDayBackgroundColor: 'transparent',
      textDisabledColor: theme.descr,
      weekVerticalMargin: 0,
      stylesheet: {
        expandable: {
          main: {
            week: {
              height: calendarHeight,
              marginTop: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
            dayContainer: {
              flex: 0,
              width: dayWidth,
              height: dayHeight,
              alignItems: 'center',
            },
          },
        },
      },
    }),
    [dayWidth, theme.descr, theme.text, theme.tint],
  );

  const handleDayPress = (day?: DateData) => {
    if (!day || day.dateString === selectedDateString) {
      return;
    }

    const nextDate = new Date(day.year, day.month - 1, day.day);
    setSelectedDate(nextDate);
    onDateChange?.(nextDate);
  };

  return (
    <View style={styles.calendar}>
      <CalendarProvider date={selectedDateString}>
        <WeekCalendar
          key={`${themeName}-${calendarWidth}`}
          current={selectedDateString}
          calendarWidth={calendarWidth}
          calendarHeight={calendarHeight}
          firstDay={1}
          allowShadow={false}
          hideDayNames
          markedDates={markedDates}
          onDayPress={handleDayPress}
          style={styles.weekRow}
          theme={calendarTheme}
          dayComponent={({ date, marking }) => (
            <CalendarDay
              date={date}
              selected={Boolean(marking?.selected)}
              dayWidth={dayWidth}
              onPress={handleDayPress}
            />
          )}
        />
      </CalendarProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
    height: calendarHeight,
    overflow: 'visible',
    marginBottom: 12
  },
  weekRow: {
    height: calendarHeight,
    justifyContent: 'space-between',
  },
  day: {
    height: dayHeight,
    borderRadius: 29,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 0}
  },
  dayNumber: {
    fontFamily: 'Inter',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
  },
  weekday: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
  },
  dot: {
    position: 'absolute',
    bottom: 5,
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
