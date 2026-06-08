import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";

const router = express.Router();

const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

const formatDate = (date) => {
    return date.toISOString().split("T")[0];
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const isHabitScheduledForDate = (habit, date) => {
    const currentDate = normalizeDate(date);
    const currentDay = currentDate.getDay();

    if (habit.activeFrom && normalizeDate(habit.activeFrom) > currentDate) {
        return false;
    }

    if (habit.activeTo && normalizeDate(habit.activeTo) < currentDate) {
        return false;
    }

    if (habit.frequency === "daily") {
        return true;
    }

    if (habit.frequency === "weekly" && habit.weeklyDay === currentDay) {
        return true;
    }

    if (habit.frequency === "custom" && habit.daysOfTheWeek.includes(currentDay)) {
        return true;
    }

    return false;
};

const calculateStreaks = (completedDates) => {
    if (completedDates.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0
        };
    }

    const dateSet = new Set(completedDates);

    let currentStreak = 0;
    let currentDate = normalizeDate(new Date());

    while (currentDate && dateSet.has(formatDate(currentDate))) {
        currentStreak++;
        currentDate = addDays(currentDate, -1);
    }

    let longestStreak = 0;
    let streak = 0;

    const sortedDates = completedDates.filter(Boolean).sort();

    for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
            streak = 1;
        } else {
            const previousDate = normalizeDate(new Date(sortedDates[i - 1]));
            const currentDate = normalizeDate(new Date(sortedDates[i]));

            const expectedNextDate = addDays(previousDate, 1);

            if (formatDate(currentDate) === formatDate(expectedNextDate)) {
                streak++;
            } else {
                streak = 1;
            }
        }

        if (streak > longestStreak) {
            longestStreak = streak;
        }
    }

    return {
        currentStreak,
        longestStreak
    };
};

// GET /statistics
router.get("/", authMiddleware, async (req, res) => {
    try {
        const logs = await HabitLog.find({
            userId: req.user.userId,
            completed: true
        });

        const habits = await Habit.find({
            userId: req.user.userId
        });

        const dailyMap = new Map();

        logs.forEach((log) => {
            const habit = habits.find((habit) => {
                return String(habit._id) === String(log.habitId);
            });

            if (!habit) return;

            if (!isHabitScheduledForDate(habit, log.date)) return;

            const dateKey = formatDate(log.date);

            if (!dailyMap.has(dateKey)) {
                dailyMap.set(dateKey, 0);
            }

            dailyMap.set(dateKey, dailyMap.get(dateKey) + 1);
        });

        const dailyCompletedHabits = Array.from(dailyMap.entries())
            .map(([date, count]) => ({
                date,
                count
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const scheduledCompletedDatesSet = new Set();

        logs.forEach((log) => {
            const habit = habits.find((habit) => {
                return String(habit._id) === String(log.habitId);
            });

            if (!habit) return;

            if (isHabitScheduledForDate(habit, log.date)) {
                scheduledCompletedDatesSet.add(formatDate(log.date));
            }
        });

        const scheduledCompletedDates = Array.from(scheduledCompletedDatesSet);

        const { currentStreak, longestStreak } = calculateStreaks(scheduledCompletedDates);

        const today = normalizeDate(new Date());

        let totalScheduledHabits = 0;
        let completedScheduledHabits = 0;

        for (let i = 0; i < 7; i++) {
            const currentDate = addDays(today, -i);

            for (const habit of habits) {
                if (!isHabitScheduledForDate(habit, currentDate)) {
                    continue;
                }

                totalScheduledHabits++;

                const completedLog = logs.find((log) => {
                    return (
                        String(log.habitId) === String(habit._id) &&
                        formatDate(log.date) === formatDate(currentDate)
                    );
                });

                if (completedLog) {
                    completedScheduledHabits++;
                }
            }
        }

        const completionRate = totalScheduledHabits === 0 ? 0 : Math.round((completedScheduledHabits / totalScheduledHabits) * 100);

        res.json({ currentStreak, longestStreak, dailyCompletedHabits, completionRate });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;