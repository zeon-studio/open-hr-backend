import { localDate } from "@/lib/dateConverter";
import { settingService } from "@/modules/setting/setting.service";
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

  const { weekends, conditionalWeekends } =
    await settingService.getWeekendsService();

  // Generate all weekend dates for the year
  const weekendObjects: any[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });

    let isWeekend = false;
    // Regular weekends
    if (weekends.includes(dayName)) {
      isWeekend = true;
    }
    // Conditional weekends
    const cw = conditionalWeekends.find((cw) => cw.name === dayName);
    if (cw) {
      // Week number in month (1-based)
      const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const weekNumber = Math.ceil(
        (d.getDate() + firstDayOfMonth.getDay()) / 7
      );
      if (cw.pattern.includes(weekNumber)) {
        isWeekend = true;
      }
    }

    if (isWeekend) {
      weekendObjects.push({
        start_date: new Date(d),
        end_date: new Date(d),
        day_count: 1,
        reason: "Weekend",
      });
    }
  }

  const calendarObj = calendar.toObject();

  const result = {
    ...calendarObj,
    weekends: weekendObjects,
  };

  return result;
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

  const upcomingHolidays = calendar.holidays
    .filter(
      (holiday) =>
        (new Date(holiday.start_date) >= currentDate &&
          new Date(holiday.start_date) <= nextMonth) ||
        (new Date(holiday.end_date) >= currentDate &&
          new Date(holiday.end_date) <= nextMonth)
    )
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

  const upcomingEvents = calendar.events
    .filter(
      (event) =>
        (new Date(event.start_date) >= currentDate &&
          new Date(event.start_date) <= nextMonth) ||
        (new Date(event.end_date) >= currentDate &&
          new Date(event.end_date) <= nextMonth)
    )
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
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
