import { localDate } from "@/lib/dateConverter";
import { Calendar } from "./calendar.model";
import { CalendarType } from "./calendar.type";

// get all calendars
const getAllCalendarService = async () => {
  const calendars = await Calendar.find();
  return calendars;
};

const getCalendarService = async (year: number) => {
  const calendar = await Calendar.findOne({ year: year });

  if (!calendar) return calendar;

  // Sort holidays and events by start_date
  calendar.holidays = calendar.holidays.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
  calendar.events = calendar.events.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  return calendar;
};

// create calendar
const createCalendarService = async (calendarData: CalendarType) => {
  calendarData.holidays = calendarData.holidays.map((holiday) => ({
    ...holiday,
    start_date: localDate(new Date(holiday.start_date)),
    end_date: localDate(new Date(holiday.end_date)),
  }));
  calendarData.events = calendarData.events.map((event) => ({
    ...event,
    start_date: localDate(new Date(event.start_date)),
    end_date: localDate(new Date(event.end_date)),
  }));

  const calendar = await Calendar.create(calendarData);
  return calendar;
};

// update calendar
const updateCalendarService = async (
  year: string,
  updateData: CalendarType
) => {
  updateData.holidays = updateData.holidays.map((holiday) => ({
    ...holiday,
    start_date: localDate(new Date(holiday.start_date)),
    end_date: localDate(new Date(holiday.end_date)),
  }));
  updateData.events = updateData.events.map((event) => ({
    ...event,
    start_date: localDate(new Date(event.start_date)),
    end_date: localDate(new Date(event.end_date)),
  }));
  const calendar = await Calendar.findOneAndUpdate({ year }, updateData, {
    new: true,
  });

  return calendar;
};

// delete calendar
const deleteCalendarService = async (year: string) => {
  const calendar = await Calendar.findOneAndDelete({ year });
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
  getCalendarService,
  createCalendarService,
  updateCalendarService,
  deleteCalendarService,
  getUpcomingEventsAndHolidaysService,
};
