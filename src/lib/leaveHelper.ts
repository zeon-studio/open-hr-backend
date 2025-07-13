import ApiError from "@/errors/ApiError";
import { Calendar } from "@/modules/calendar/calendar.model";
import { LeaveRequest } from "@/modules/leave-request/leave-request.model";
import { LeaveRequestType } from "@/modules/leave-request/leave-request.type";
import { Leave } from "@/modules/leave/leave.model";
import { settingService } from "@/modules/setting/setting.service";
import {
  differenceInDays,
  eachDayOfInterval,
  endOfDay,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";

// Helper function to get week number of the month (1-based)
const getWeekOfMonth = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
};

// leave day counter
export const dayCounterWithoutHoliday = async (
  startDate: Date,
  endDate: Date
) => {
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }

  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date");
  }

  const year = startDate.getFullYear();

  try {
    const holidayRecords = await Calendar.find({ year });
    const holidays = holidayRecords.flatMap((record) => record.holidays);

    const start = startOfDay(startDate);
    const end = endOfDay(endDate);
    const daysInterval = eachDayOfInterval({ start, end });

    const { weekends, conditionalWeekends } =
      await settingService.getWeekendsService();

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

    // Find all weekends in the interval
    const weekendInterval = daysInterval.filter((day) => {
      const dayName = day.toLocaleDateString("en-US", { weekday: "long" });

      // Check regular weekend days
      if (weekends.includes(dayName)) {
        return true;
      }

      // Check conditional weekend days
      const conditionalWeekend = conditionalWeekends.find(
        (cw) => cw.name === dayName
      );
      if (conditionalWeekend) {
        const weekNumber = getWeekOfMonth(day);
        return conditionalWeekend.pattern.includes(weekNumber);
      }

      return false;
    });

    // Find weekends that are not within holidays
    const nonHolidayWeekends = weekendInterval.filter(
      (weekend) =>
        !holidayDays.some((holiday) => {
          const holidayStart = startOfDay(
            parseISO(new Date(holiday.start_date).toISOString())
          );
          const holidayEnd = endOfDay(
            parseISO(new Date(holiday.end_date).toISOString())
          );
          return isWithinInterval(weekend, {
            start: holidayStart,
            end: holidayEnd,
          });
        })
    );

    const totalDays = differenceInDays(end, start) + 1;
    let finalDays = totalDays - totalHolidays - nonHolidayWeekends.length;

    return Math.max(0, finalDays); // Ensure non-negative result
  } catch (error) {
    console.error("Error calculating leave days:", error);
    throw new Error("Failed to calculate leave days");
  }
};

// leave data validator
export const leaveValidator = async (data: LeaveRequestType) => {
  if (!data) {
    throw new ApiError("Leave request data is required", 400);
  }

  const { leave_type, employee_id, start_date, end_date } = data;

  if (!leave_type || !employee_id || !start_date || !end_date) {
    throw new ApiError("All required fields must be provided", 400);
  }

  const year = start_date.getFullYear();
  const leaveTypes = ["casual", "earned", "sick", "without_pay"];

  if (!leaveTypes.includes(leave_type)) {
    throw new ApiError("Invalid leave type", 400);
  }

  const selectYear = `years.${leave_type}`;

  const leaveData = await Leave.findOne(
    { employee_id, "years.year": year },
    { [selectYear]: 1, "years.year": 1, _id: 0 }
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

  // Check for overlapping leave requests with status "approved" or "pending"
  const overlappingLeave = await LeaveRequest.findOne({
    employee_id,
    status: { $in: ["approved", "pending"] },
    $or: [
      { start_date: { $lte: end_date }, end_date: { $gte: start_date } },
      { start_date: { $lte: start_date }, end_date: { $gte: end_date } },
    ],
  });

  if (overlappingLeave) {
    throw new ApiError(
      `Leave request overlaps with an existing leave from ${overlappingLeave.start_date} to ${overlappingLeave.end_date}`,
      400
    );
  }

  return yearData;
};

// calculate leave based on join date
export function calculateRemainingLeave(
  joinDate: string | Date,
  leaveAllottedPerYear: number
): number {
  if (!joinDate || typeof leaveAllottedPerYear !== "number") {
    throw new Error("Join date and leave allotted per year are required");
  }

  if (leaveAllottedPerYear < 0) {
    throw new Error("Leave allotted per year must be non-negative");
  }

  // Convert joinDate to a Date object
  const joinDateObj = new Date(joinDate);
  const currentYear = joinDateObj.getFullYear();

  // Calculate the total number of days in the year
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const totalDaysInYear =
    (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1;

  // Calculate the number of days worked since join date till end of year
  const daysWorked =
    (endOfYear.getTime() - joinDateObj.getTime()) / (1000 * 60 * 60 * 24) + 1;

  // Calculate remaining leave based on proportional days worked
  const remainingLeave = (daysWorked / totalDaysInYear) * leaveAllottedPerYear;

  // Return remaining leave rounded to two decimal places
  return Math.round((remainingLeave * 100) / 100);
}
