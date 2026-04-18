import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/database.js";
import User from "./models/User.js";

import habitsRoutes from "./routes/habitsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

config();

const app = express();

connectDB();

app.use(cors());
app.use(json());

app.use("/auth", authRoutes);
app.use("/habits", habitsRoutes);

app.get("/", (req, res) => {
  res.send("Habit App API Running");
});

app.get("/test-user", async (req, res) => {
  const user = await User.create({
    username: "test",
    email: "test@test.com",
    passwordHash: "123456"
  });

  res.json(user);
}); //testing route for the database connection

const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});