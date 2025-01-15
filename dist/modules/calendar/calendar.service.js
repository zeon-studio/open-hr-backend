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
exports.calendarService = void 0;
const calendar_model_1 = require("./calendar.model");
// get all calendars
const getAllCalendarService = () => __awaiter(void 0, void 0, void 0, function* () {
    const calendars = yield calendar_model_1.Calendar.find();
    return calendars;
});
// create calendar
const createCalendarService = (calendarData) => __awaiter(void 0, void 0, void 0, function* () {
    const calendar = yield calendar_model_1.Calendar.create(calendarData);
    return calendar;
});
// update calendar
const updateCalendarService = (calendarId, calendarData) => __awaiter(void 0, void 0, void 0, function* () {
    const calendar = yield calendar_model_1.Calendar.findByIdAndUpdate(calendarId, calendarData, {
        new: true,
    });
    return calendar;
});
// delete calendar
const deleteCalendarService = (calendarId) => __awaiter(void 0, void 0, void 0, function* () {
    const calendar = yield calendar_model_1.Calendar.findByIdAndDelete(calendarId);
    return calendar;
});
exports.calendarService = {
    getAllCalendarService,
    createCalendarService,
    updateCalendarService,
    deleteCalendarService,
};
//# sourceMappingURL=calendar.service.js.map