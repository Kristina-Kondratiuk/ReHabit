import { Schema, model } from "mongoose";

const habitLogSchema = new Schema({
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
    default: false
  }
});

habitLogSchema.index( 
  { habitId: 1, userId: 1, date: 1 },
  { unique: true }
); 

export default model("HabitLog", habitLogSchema);