"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveValidator = exports.dayCounterWithoutHoliday = void 0;
exports.calculateRemainingLeave = calculateRemainingLeave;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const calendar_model_1 = require("../modules/calendar/calendar.model");
const leave_request_model_1 = require("../modules/leave-request/leave-request.model");
const leave_model_1 = require("../modules/leave/leave.model");
const setting_service_1 = require("../modules/setting/setting.service");
const date_fns_1 = require("date-fns");
// Helper function to get week number of the month (1-based)
const getWeekOfMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
};
// leave day counter
const dayCounterWithoutHoliday = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const year = startDate.getFullYear();
    const holidayRecords = yield calendar_model_1.Calendar.find({ year });
    // Flatten the holidays from each record
    const holidays = holidayRecords.flatMap((record) => record.holidays);
    // Ensure start and end are at the start and end of their respective days
    const start = (0, date_fns_1.startOfDay)(startDate);
    const end = (0, date_fns_1.endOfDay)(endDate);
    const daysInterval = (0, date_fns_1.eachDayOfInterval)({ start, end });
    // Fetch weekends and conditional weekends from settings
    const { weekends, conditionalWeekends } = yield setting_service_1.settingService.getWeekendsService();
    // Modify the holiday filtering logic to handle edge cases
    const holidayDays = holidays.filter((holiday) => {
        const holidayStart = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(new Date(holiday.start_date).toISOString()));
        const holidayEnd = (0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(new Date(holiday.end_date).toISOString()));
        // Comprehensive overlap check
        return (
        // Holiday starts within the range
        (holidayStart >= start && holidayStart <= end) ||
            // Holiday ends within the range
            (holidayEnd >= start && holidayEnd <= end) ||
            // Holiday completely encompasses the range
            (holidayStart <= start && holidayEnd >= end));
    });
    // Calculate total holidays with precise overlap
    const totalHolidays = holidayDays.reduce((count, holiday) => {
        const holidayStart = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(new Date(holiday.start_date).toISOString()));
        const holidayEnd = (0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(new Date(holiday.end_date).toISOString()));
        // Determine the precise overlap
        const overlapStart = holidayStart > start ? holidayStart : start;
        const overlapEnd = holidayEnd < end ? holidayEnd : end;
        // Calculate the number of overlapping days
        const overlappingDays = (0, date_fns_1.differenceInDays)(overlapEnd, overlapStart) + 1;
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
        const conditionalWeekend = conditionalWeekends.find((cw) => cw.name === dayName);
        if (conditionalWeekend) {
            const weekNumber = getWeekOfMonth(day);
            return conditionalWeekend.pattern.includes(weekNumber);
        }
        return false;
    });
    // Find weekends that are not within holidays
    const nonHolidayWeekends = weekendInterval.filter((weekend) => !holidayDays.some((holiday) => {
        const holidayStart = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(new Date(holiday.start_date).toISOString()));
        const holidayEnd = (0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(new Date(holiday.end_date).toISOString()));
        return (0, date_fns_1.isWithinInterval)(weekend, {
            start: holidayStart,
            end: holidayEnd,
        });
    }));
    const totalDays = (0, date_fns_1.differenceInDays)(end, start) + 1;
    let finalDays = totalDays;
    // Reduce days for holidays
    finalDays -= totalHolidays;
    // Reduce days for non-holiday weekends
    finalDays -= nonHolidayWeekends.length;
    return finalDays;
});
exports.dayCounterWithoutHoliday = dayCounterWithoutHoliday;
// leave data validator
const leaveValidator = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { leave_type, employee_id, start_date, end_date } = data;
    const year = start_date.getFullYear();
    const leaveTypes = ["casual", "earned", "sick", "without_pay"];
    if (!leaveTypes.includes(leave_type)) {
        throw new ApiError_1.default("Invalid leave type", 400);
    }
    const selectYear = `years.${leave_type}`;
    const leaveData = yield leave_model_1.Leave.findOne({ employee_id, "years.year": year }, { [selectYear]: 1, "years.year": 1, _id: 0 }).exec();
    if (!leaveData) {
        throw new ApiError_1.default(`No leave data found for user ${employee_id} in year ${year}`, 400, "");
    }
    const yearData = leaveData.years.find((y) => y.year === year);
    if (!yearData) {
        throw new Error(`Leave data for year ${year} not found`);
    }
    // Check for overlapping leave requests with status "approved" or "pending"
    const overlappingLeave = yield leave_request_model_1.LeaveRequest.findOne({
        employee_id,
        status: { $in: ["approved", "pending"] },
        $or: [
            { start_date: { $lte: end_date }, end_date: { $gte: start_date } },
            { start_date: { $lte: start_date }, end_date: { $gte: end_date } },
        ],
    });
    if (overlappingLeave) {
        throw new ApiError_1.default(`Leave request overlaps with an existing leave from ${overlappingLeave.start_date} to ${overlappingLeave.end_date}`, 400);
    }
    return yearData;
});
exports.leaveValidator = leaveValidator;
// calculate leave based on join date
function calculateRemainingLeave(joinDate, leaveAllottedPerYear) {
    // Convert joinDate to a Date object
    const joinDateObj = new Date(joinDate);
    const currentYear = joinDateObj.getFullYear();
    // Calculate the total number of days in the year
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    const totalDaysInYear = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1;
    // Calculate the number of days worked since join date till end of year
    const daysWorked = (endOfYear.getTime() - joinDateObj.getTime()) / (1000 * 60 * 60 * 24) + 1;
    // Calculate remaining leave based on proportional days worked
    const remainingLeave = (daysWorked / totalDaysInYear) * leaveAllottedPerYear;
    // Return remaining leave rounded to two decimal places
    return Math.round((remainingLeave * 100) / 100);
}
//# sourceMappingURL=leaveHelper.js.map