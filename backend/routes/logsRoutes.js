import express from "express";
import HabitLog from "../models/HabitLog.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Habit from "../models/Habit.js";

const router = express.Router();

// GET /logs?month=2026-05
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { month } = req.query; // "2026-05"

        if (!month) {
            return res.status(404).json({ message: "Month is required" });
        }

        const start = new Date(`${month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1)

        const logs = await HabitLog.find ({
            userId: req.user.userId,
            date: {
                $gte: start,
                $lt: end
            }
        });

        res.json(logs);

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /logs/:habitId/complete
router.post("/:habitId/complete", authMiddleware, async (req, res) => { 
    try {
        const { habitId } = req.params;

        //add ObjectId validation? to avoid frontend sending smth like: /logs/abc123/complete

        const today = new Date();  // time doesnt matter, the day has to be the same
        today.setHours(0, 0, 0, 0); 

        const habit = await Habit.findOne({
            _id: habitId,
            userId: req.user.userId
        });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        } // needed or not

        let log = await HabitLog.findOneAndUpdate(
            {
                habitId: habitId,
                userId: req.user.userId,
                date: today
            },
            {
                completed: true
            },
            {
              new: true,
              upsert: true  
            }
        );

        res.json(log);
 
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Server error." })
    }
});

// DELETE /logs/:habitId/complete
router.delete("/:habitId/complete", authMiddleware, async (req, res) => {
    try {
        const { habitId } = req.params;

        const today = new Date(); 
        today.setHours(0, 0, 0, 0); 

        const habit = await Habit.findOne({
            _id: habitId,
            userId: req.user.userId
        });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        } // needed or not

        const deletedLog = await HabitLog.findOneAndDelete({
            habitId: habitId,
            userId: req.user.userId,
            date: today,
        });

        if (!deletedLog) {
            return res.status(404).json({ message: "Log not found" });
        }

        res.json({ message: "Habit marked as incomplete" })

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /logs/habit/:habitId/logs
router.get("/habit/:habitId/logs", authMiddleware, async (req, res) => {
    try {
        const { habitId } = req.params;

        const habit = await Habit.findOne({
            _id: habitId,
            userId: req.user.userId
        });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const logs = await HabitLog.find({
            habitId: habitId,
            userId: req.user.userId
        }).sort({ date: 1 })

        res.json(logs);

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;