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

  type: {
    type: String,
    enum: ["build", "quit"],
    required: true
  },

  icon: {
    type: String, 
  },

  color: {
    type: String,
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

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model("Habit", habitSchema);