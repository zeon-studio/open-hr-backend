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
exports.leaveValidator = exports.dayCounter = void 0;
exports.calculateRemainingLeave = calculateRemainingLeave;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const leave_request_model_1 = require("../modules/leave-request/leave-request.model");
const leave_model_1 = require("../modules/leave/leave.model");
const date_fns_1 = require("date-fns");
// leave day counter
const dayCounter = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
    }
    if (startDate > endDate) {
        throw new Error("Start date cannot be after end date");
    }
    // Count all days including holidays and weekends
    try {
        const start = (0, date_fns_1.startOfDay)(startDate);
        const end = (0, date_fns_1.endOfDay)(endDate);
        const totalDays = (0, date_fns_1.differenceInDays)(end, start) + 1;
        return Math.max(0, totalDays);
    }
    catch (error) {
        console.error("Error calculating leave days:", error);
        throw new Error("Failed to calculate leave days");
    }
});
exports.dayCounter = dayCounter;
// leave data validator
const leaveValidator = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data) {
        throw new ApiError_1.default("Leave request data is required", 400);
    }
    const { leave_type, employee_id, start_date, end_date } = data;
    if (!leave_type || !employee_id || !start_date || !end_date) {
        throw new ApiError_1.default("All required fields must be provided", 400);
    }
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
    const totalDaysInYear = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1;
    // Calculate the number of days worked since join date till end of year
    const daysWorked = (endOfYear.getTime() - joinDateObj.getTime()) / (1000 * 60 * 60 * 24) + 1;
    // Calculate remaining leave based on proportional days worked
    const remainingLeave = (daysWorked / totalDaysInYear) * leaveAllottedPerYear;
    // Return remaining leave rounded to two decimal places
    return Math.round((remainingLeave * 100) / 100);
}
//# sourceMappingURL=leaveHelper.js.map