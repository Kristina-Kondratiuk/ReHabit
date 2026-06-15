import { Schema, model } from "mongoose";

const habitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  icon: {
    type: String,
    enum: ["droplet", "dumbbell", "book-open", "wine-off", "cigarette-off", "graduation-cap", "utensils", "sport-shoe"],
    default: "droplet"
  },

  color: {
    type: String,
    enum: ["yellow", "green", "blue", "purple"],
    default: "blue"
  },

  type: {
    type: String,
    enum: ["build", "quit"],
    required: true
  },

  frequency: {
    type: String,
    enum: ["daily", "weekly", "custom"],
    default: "daily"
  },

  daysOfTheWeek: {
    type: [Number],
    default: []
  },

  weeklyDay: {
    type: Number,
    min: 0,
    max: 6
  },

  activeFrom: {
    type: Date,
    required: true
  },

  activeTo: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model("Habit", habitSchema);
