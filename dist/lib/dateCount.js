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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateCount = void 0;
const calendar_model_1 = require("../modules/calendar/calendar.model");
const date_fns_1 = require("date-fns");
const dateCount = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const start = (0, date_fns_1.parseISO)(startDate);
    const end = (0, date_fns_1.parseISO)(endDate);
    const daysInterval = (0, date_fns_1.eachDayOfInterval)({ start, end });
    const hasFriday = daysInterval.some((day) => (0, date_fns_1.isFriday)(day));
    const totalDays = (0, date_fns_1.differenceInDays)(end, start) + 1;
    const holidayRecords = yield calendar_model_1.Calendar.find({}); // Fetch all holiday records
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
        const overlappingDays = (0, date_fns_1.differenceInDays)(overlapEnd, overlapStart) + 1;
        return count + (overlappingDays > 0 ? overlappingDays : 0); // Only count positive overlaps
    }, 0);
    // Check if any Fridays fall within the holiday range
    const fridaysInHolidays = daysInterval.some((day) => (0, date_fns_1.isFriday)(day) &&
        holidayDays.some((holiday) => {
            const holidayStart = new Date(holiday.start_date);
            const holidayEnd = new Date(holiday.end_date);
            return day >= holidayStart && day <= holidayEnd;
        }));
    let finalDays = totalDays;
    // Only reduce for Friday if it is not in the holiday range
    if (hasFriday && !fridaysInHolidays) {
        finalDays -= 1;
    }
    finalDays -= totalHolidays; // Reduce for holidays
    return finalDays;
});
exports.dateCount = dateCount;
//# sourceMappingURL=dateCount.js.map