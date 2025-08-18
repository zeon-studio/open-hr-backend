import ApiError from "@/errors/ApiError";
import { LeaveRequest } from "@/modules/leave-request/leave-request.model";
import { LeaveRequestType } from "@/modules/leave-request/leave-request.type";
import { Leave } from "@/modules/leave/leave.model";
import { differenceInDays, endOfDay, startOfDay } from "date-fns";

// leave day counter
export const dayCounter = async (startDate: Date, endDate: Date) => {
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }

  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date");
  }

  // Count all days including holidays and weekends
  try {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);
    const totalDays = differenceInDays(end, start) + 1;
    return Math.max(0, totalDays);
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
