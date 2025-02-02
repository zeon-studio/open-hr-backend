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
exports.calendarController = void 0;
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const sendResponse_1 = require("../../lib/sendResponse");
const calendar_service_1 = require("./calendar.service");
// get all data
const getAllCalendarController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const calendar = yield calendar_service_1.calendarService.getAllCalendarService();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: calendar,
        meta: {
            total: calendar.length,
        },
        message: "data get successfully",
    });
}));
const getCalendarController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const year = Number(req.params.year);
    const calendar = yield calendar_service_1.calendarService.getCalendarService(year);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: calendar,
        message: "data get successfully",
    });
}));
// create data
const createCalendarController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const calendarData = req.body;
    const calendar = yield calendar_service_1.calendarService.createCalendarService(calendarData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: calendar,
        message: "data created successfully",
    });
}));
// update data
const updateCalendarController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const year = req.params.year;
    const updateData = req.body;
    yield calendar_service_1.calendarService.updateCalendarService(year, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
    });
}));
// delete data
const deleteCalendarController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const year = req.params.year;
    yield calendar_service_1.calendarService.deleteCalendarService(year);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data deleted successfully",
    });
}));
// get upcoming events and holidays
const getUpcomingEventsAndHolidaysController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const current_date = req.params.current_date
        ? new Date(req.params.current_date)
        : new Date();
    const calendar = yield calendar_service_1.calendarService.getUpcomingEventsAndHolidaysService(current_date);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: calendar,
        message: "data get successfully",
    });
}));
exports.calendarController = {
    getAllCalendarController,
    getCalendarController,
    createCalendarController,
    updateCalendarController,
    deleteCalendarController,
    getUpcomingEventsAndHolidaysController,
};
//# sourceMappingURL=calendar.controller.js.map