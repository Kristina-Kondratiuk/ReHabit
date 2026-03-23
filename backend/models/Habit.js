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

  frequency: {
    type: String,
    enum: ["daily", "weekly"],
    default: "daily"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model("Habit", habitSchema);