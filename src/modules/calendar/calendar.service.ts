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

// get upcoming events and holidays
const getUpcomingEventsAndHolidaysService = async (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const nextMonth = new Date(currentDate);
  nextMonth.setDate(currentDate.getDate() + 30);

  const calendar = await Calendar.findOne({ year });

  if (!calendar) {
    return { holidays: [], events: [] };
  }

  const upcomingHolidays = calendar.holidays.filter(
    (holiday) =>
      (new Date(holiday.start_date) >= currentDate &&
        new Date(holiday.start_date) <= nextMonth) ||
      (new Date(holiday.end_date) >= currentDate &&
        new Date(holiday.end_date) <= nextMonth)
  );

  const upcomingEvents = calendar.events.filter(
    (event) =>
      (new Date(event.start_date) >= currentDate &&
        new Date(event.start_date) <= nextMonth) ||
      (new Date(event.end_date) >= currentDate &&
        new Date(event.end_date) <= nextMonth)
  );

  return { holidays: upcomingHolidays, events: upcomingEvents };
};

export const calendarService = {
  getAllCalendarService,
  createCalendarService,
  updateCalendarService,
  deleteCalendarService,
  getUpcomingEventsAndHolidaysService,
};
