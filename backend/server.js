import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/database.js";
import User from "./models/User.js";

import habitsRoutes from "./routes/habitsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";

config();

const app = express();

connectDB();

app.use(cors());
app.use(json());

app.use("/auth", authRoutes);
app.use("/habits", habitsRoutes);
app.use("/logs", logsRoutes);

app.get("/", (req, res) => {
  res.send("Habit App API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});