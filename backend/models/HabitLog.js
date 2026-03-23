import { Schema, model } from "mongoose";

const habitLogSchema = new Schema({ // for tracking the progress
  habitId: {
    type: Schema.Types.ObjectId,
    ref: "Habit",
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  completed: {
    type: Boolean,
    default: true
  }
});

/* habitLogSchema.index( 
  { habitId: 1, date: 1 },
  { unique: true }
); for preventing logs for the same habit on the same day */

export default model("HabitLog", habitLogSchema);