import { Calendar } from "./calendar.model";
import { CalendarType } from "./calendar.type";

// get all calendars
const getAllCalendarService = async () => {
  const calendars = await Calendar.find();
  return calendars;
};

// create calendar
const createCalendarService = async (calendarData: CalendarType) => {
  const calendar = await Calendar.create(calendarData);
  return calendar;
};

// update calendar
const updateCalendarService = async (
  calendarId: string,
  calendarData: CalendarType
) => {
  const calendar = await Calendar.findByIdAndUpdate(calendarId, calendarData, {
    new: true,
  });
  return calendar;
};

// delete calendar
const deleteCalendarService = async (calendarId: string) => {
  const calendar = await Calendar.findByIdAndDelete(calendarId);
  return calendar;
};

export const calendarService = {
  getAllCalendarService,
  createCalendarService,
  updateCalendarService,
  deleteCalendarService,
};
