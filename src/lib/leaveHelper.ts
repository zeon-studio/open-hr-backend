import ApiError from "@/errors/ApiError";
import { Calendar } from "@/modules/calendar/calendar.model";
import { LeaveRequestType } from "@/modules/leave-request/leave-request.type";
import { Leave } from "@/modules/leave/leave.model";
import {
  differenceInDays,
  eachDayOfInterval,
  endOfDay,
  isFriday,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";

export const leaveDayCounter = async (startDate: Date, endDate: Date) => {
  const year = startDate.getFullYear();

  const holidayRecords = await Calendar.find({ year });

  // Flatten the holidays from each record
  const holidays = holidayRecords.flatMap((record) => record.holidays);

  // Ensure start and end are at the start and end of their respective days
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const daysInterval = eachDayOfInterval({ start, end });

  // Modify the holiday filtering logic to handle edge cases
  const holidayDays = holidays.filter((holiday) => {
    const holidayStart = startOfDay(
      parseISO(new Date(holiday.start_date).toISOString())
    );
    const holidayEnd = endOfDay(
      parseISO(new Date(holiday.end_date).toISOString())
    );

    // Comprehensive overlap check
    return (
      // Holiday starts within the range
      (holidayStart >= start && holidayStart <= end) ||
      // Holiday ends within the range
      (holidayEnd >= start && holidayEnd <= end) ||
      // Holiday completely encompasses the range
      (holidayStart <= start && holidayEnd >= end)
    );
  });

  // Calculate total holidays with precise overlap
  const totalHolidays = holidayDays.reduce((count, holiday) => {
    const holidayStart = startOfDay(
      parseISO(new Date(holiday.start_date).toISOString())
    );
    const holidayEnd = endOfDay(
      parseISO(new Date(holiday.end_date).toISOString())
    );

    // Determine the precise overlap
    const overlapStart = holidayStart > start ? holidayStart : start;
    const overlapEnd = holidayEnd < end ? holidayEnd : end;

    // Calculate the number of overlapping days
    const overlappingDays = differenceInDays(overlapEnd, overlapStart) + 1;

    return count + overlappingDays;
  }, 0);

  // Find all Fridays in the interval
  const fridaysInInterval = daysInterval.filter((day) => isFriday(day));

  // Find Fridays that are not within holidays
  const nonHolidayFridays = fridaysInInterval.filter(
    (friday) =>
      !holidayDays.some((holiday) => {
        const holidayStart = startOfDay(
          parseISO(new Date(holiday.start_date).toISOString())
        );
        const holidayEnd = endOfDay(
          parseISO(new Date(holiday.end_date).toISOString())
        );
        return isWithinInterval(friday, {
          start: holidayStart,
          end: holidayEnd,
        });
      })
  );

  const totalDays = differenceInDays(end, start) + 1;

  let finalDays = totalDays;

  // Reduce days for holidays
  finalDays -= totalHolidays;

  // Reduce days for non-holiday Fridays
  finalDays -= nonHolidayFridays.length;

  return finalDays;
};

// get leave
export const leaveDataFinder = async (data: LeaveRequestType) => {
  const { leave_type, employee_id, start_date } = data;
  const year = start_date.getFullYear();
  const leaveTypes = ["casual", "earned", "sick", "without_pay"];

  if (!leaveTypes.includes(leave_type)) {
    throw new ApiError("Invalid leave type", 400, "");
  }

  const selectPath = `years.${leave_type}`;

  const leaveData = await Leave.findOne(
    { employee_id, "years.year": year },
    { [selectPath]: 1, "years.year": 1, _id: 0 }
  ).exec();

  if (!leaveData) {
    throw new ApiError(
      `No leave data found for user ${employee_id} in year ${year}`,
      400,
      ""
    );
  }

  const yearData = leaveData.years.find((y) => y.year === year);
  if (!yearData) {
    throw new Error(`Leave data for year ${year} not found`);
  }

  return yearData;
};
