import mongoose, { model } from "mongoose";
import { CalendarType } from "./calendar.type";

const calendarSchema = new mongoose.Schema<CalendarType>(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },
    holidays: [
      {
        start_date: {
          type: Date,
        },
        end_date: {
          type: Date,
        },
        day_count: {
          type: Number,
        },
        reason: {
          type: String,
        },
      },
    ],
    events: [
      {
        start_date: {
          type: Date,
        },
        end_date: {
          type: Date,
        },
        day_count: {
          type: Number,
        },
        reason: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// index for faster search
calendarSchema.index({ year: 1 });

export const Calendar = model<CalendarType>("calendar", calendarSchema);
