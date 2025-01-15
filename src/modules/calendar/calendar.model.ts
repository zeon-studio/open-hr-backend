import mongoose, { model } from "mongoose";
import { CalendarType } from "./calendar.type";

const calendarSchema = new mongoose.Schema<CalendarType>(
  {
    year: {
      type: Number,
      required: true,
    },
    holidays: [
      {
        name: {
          type: String,
        },
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
        name: {
          type: String,
        },
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

export const Calendar = model<CalendarType>("calendar", calendarSchema);
