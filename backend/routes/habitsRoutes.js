import express from "express";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//GET /habits
router.get("/", authMiddleware, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.userId });

        res.json(habits);
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Server error." });

    }
});

//POST /habits
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, type, frequency, color, icon, daysOfTheWeek } = req.body;

        if (!title || !type) {
            res.status(400).json({ message: "Title and type are required." });
        }

        const habit = await Habit.create({
            userId: req.user.userId,
            title,
            description,
            type,
            frequency,
            icon,
            color,
            daysOfTheWeek
        });

        res.status(201).json(habit);
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Server error." })

    }
});

//PUT /habits/:id
router.put("/:id", authMiddleware, async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, frequency, color, icon, daysOfTheWeek } = req.body;

        const updatedHabit = await Habit.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            { title, description, type, frequency, color, icon, daysOfTheWeek },
            { new: true, runValidators: true }
        );

        if (!updatedHabit) {
            return res.status(404).json({ message: "Habit not found. "});
        }

        res.json(updatedHabit);
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Server error."});
    }
});

// DELETE /habits/:id
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedHabit = await Habit.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!deletedHabit) {
            return res.status(404).json({ message: "Habit not found. "});
        }

        res.json({ message: "Habit deleted successfully." });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Server error."});
    }
});

export default router;
