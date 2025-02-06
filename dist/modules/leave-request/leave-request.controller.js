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
exports.leaveRequestController = void 0;
const constants_1 = require("../../config/constants");
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const filterPicker_1 = __importDefault(require("../../lib/filterPicker"));
const sendResponse_1 = require("../../lib/sendResponse");
const leave_request_service_1 = require("./leave-request.service");
// get all data
const getAllLeaveRequestController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, filterPicker_1.default)(req.query, constants_1.paginationField);
    const filterOption = (0, filterPicker_1.default)(req.query, ["search", "employee_id"]);
    const leave = yield leave_request_service_1.leaveRequestService.getAllLeaveRequestService(paginationOptions, filterOption);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: leave.result,
        meta: leave.meta,
        message: "data get successfully",
    });
}));
// get single data
const getLeaveRequestController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const leave = yield leave_request_service_1.leaveRequestService.getLeaveRequestService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: leave,
        message: "data get successfully",
    });
}));
// create data
const createLeaveRequestController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const leaveData = req.body;
    const leave = yield leave_request_service_1.leaveRequestService.createLeaveRequestService(leaveData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: leave,
        message: "data created successfully",
    });
}));
// update data
const updateLeaveRequestController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    yield leave_request_service_1.leaveRequestService.updateLeaveRequestService(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
    });
}));
// delete data
const deleteLeaveRequestController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield leave_request_service_1.leaveRequestService.deleteLeaveRequestService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data deleted successfully",
    });
}));
// get upcoming leave request
const getUpcomingLeaveRequestController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const current_date = req.params.current_date
        ? new Date(req.params.current_date)
        : new Date();
    const leave = yield leave_request_service_1.leaveRequestService.getUpcomingLeaveRequestService(current_date);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: leave,
        message: "data get successfully",
    });
}));
// get upcoming leave request individual date
const getUpcomingLeaveRequestDatesController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const current_date = req.params.current_date
        ? new Date(req.params.current_date)
        : new Date();
    const leave = yield leave_request_service_1.leaveRequestService.getUpcomingLeaveRequestDatesService(current_date);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: leave,
        message: "data get successfully",
    });
}));
exports.leaveRequestController = {
    getAllLeaveRequestController,
    getLeaveRequestController,
    createLeaveRequestController,
    updateLeaveRequestController,
    deleteLeaveRequestController,
    getUpcomingLeaveRequestController,
    getUpcomingLeaveRequestDatesController,
};
//# sourceMappingURL=leave-request.controller.js.map