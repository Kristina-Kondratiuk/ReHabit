import { create } from 'zustand';

export type HabitLog = {
  _id?: string;
  habitId: string;
  date: string;
  completed?: boolean;
  isLocal?: boolean;
};

type HabitLogsStore = {
  logs: HabitLog[];
  replaceLogs: (logs: HabitLog[]) => void;
  setMonthLogs: (month: string, logs: HabitLog[]) => void;
  markComplete: (habitId: string, date: string) => void;
  confirmComplete: (habitId: string, date: string, log?: HabitLog) => void;
  markIncomplete: (habitId: string, date: string) => void;
  removeHabitLogs: (habitId: string) => void;
};

const toDateKey = (value: string) => {
  if (!value.includes('T')) {
    return value;
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const normalizeLog = (log: HabitLog): HabitLog => ({
  ...log,
  habitId: String(log.habitId),
  date: toDateKey(log.date),
});

const isSameLog = (log: HabitLog, habitId: string, date: string) => {
  return String(log.habitId) === habitId && toDateKey(log.date) === date;
};

export const useHabitLogsStore = create<HabitLogsStore>((set) => ({
  logs: [],

  replaceLogs: (logs) => {
    set({ logs: logs.map(normalizeLog) });
  },

  setMonthLogs: (month, logs) => {
    const serverLogs = logs.map((log) => ({ ...normalizeLog(log), isLocal: false }));

    set((state) => {
      const logsWithoutServerDuplicates = state.logs.filter(
        (log) =>
          !serverLogs.some((serverLog) => isSameLog(log, String(serverLog.habitId), serverLog.date))
      );

      return {
        logs: [...logsWithoutServerDuplicates, ...serverLogs],
      };
    });
  },

  markComplete: (habitId, date) => {
    set((state) => {
      const logsWithoutSelected = state.logs.filter((log) => !isSameLog(log, habitId, date));

      return {
        logs: [
          ...logsWithoutSelected,
          {
            habitId,
            date,
            completed: true,
            isLocal: true,
          },
        ],
      };
    });
  },

  confirmComplete: (habitId, date, log) => {
    set((state) => {
      const logsWithoutSelected = state.logs.filter((currentLog) => !isSameLog(currentLog, habitId, date));
      const confirmedLog = normalizeLog(
        {
          ...log,
          habitId,
          date,
          completed: true,
        }
      );

      return {
        logs: [
          ...logsWithoutSelected,
          {
            ...confirmedLog,
            completed: true,
            isLocal: false,
          },
        ],
      };
    });
  },

  markIncomplete: (habitId, date) => {
    set((state) => ({
      logs: state.logs.filter((log) => !isSameLog(log, habitId, date)),
    }));
  },

  removeHabitLogs: (habitId) => {
    set((state) => ({
      logs: state.logs.filter((log) => String(log.habitId) !== habitId),
    }));
  },
}));
