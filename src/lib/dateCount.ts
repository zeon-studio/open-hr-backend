import { Calendar } from "@/modules/calendar/calendar.model";
import {
  differenceInDays,
  eachDayOfInterval,
  isFriday,
  parseISO,
} from "date-fns";

export const dateCount = async (startDate: string, endDate: string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const daysInterval = eachDayOfInterval({ start, end });
  const hasFriday = daysInterval.some((day) => isFriday(day));

  const totalDays = differenceInDays(end, start) + 1;

  const holidayRecords = await Calendar.find({}); // Fetch all holiday records

  // Flatten the holidays from each record
  const holidaysAndEvents = holidayRecords.flatMap((record) => record.holidays);

  // Check for holidays and events in the interval
  const holidayDays = holidaysAndEvents.filter((holiday) => {
    const holidayStart = new Date(holiday.start_date); // Adjust if necessary
    const holidayEnd = new Date(holiday.end_date); // Adjust if necessary
    return daysInterval.some((day) => day >= holidayStart && day <= holidayEnd);
  });

  // Calculate the total days to reduce based on the overlap
  const totalHolidays = holidayDays.reduce((count, holiday) => {
    const holidayStart = new Date(holiday.start_date);
    const holidayEnd = new Date(holiday.end_date);

    // Calculate the overlap
    const overlapStart = holidayStart > start ? holidayStart : start;
    const overlapEnd = holidayEnd < end ? holidayEnd : end;

    // Calculate the number of overlapping days
    const overlappingDays = differenceInDays(overlapEnd, overlapStart) + 1;

    return count + (overlappingDays > 0 ? overlappingDays : 0); // Only count positive overlaps
  }, 0);

  // Check if any Fridays fall within the holiday range
  const fridaysInHolidays = daysInterval.some(
    (day) =>
      isFriday(day) &&
      holidayDays.some((holiday) => {
        const holidayStart = new Date(holiday.start_date);
        const holidayEnd = new Date(holiday.end_date);
        return day >= holidayStart && day <= holidayEnd;
      })
  );

  let finalDays = totalDays;

  // Only reduce for Friday if it is not in the holiday range
  if (hasFriday && !fridaysInHolidays) {
    finalDays -= 1;
  }

  finalDays -= totalHolidays; // Reduce for holidays

  return finalDays;
};
