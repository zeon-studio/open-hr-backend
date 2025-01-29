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
exports.employeeOnboardingController = void 0;
const constants_1 = require("../../config/constants");
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const filterPicker_1 = __importDefault(require("../../lib/filterPicker"));
const sendResponse_1 = require("../../lib/sendResponse");
const employee_onboarding_service_1 = require("./employee-onboarding.service");
// get all data
const getAllEmployeeOnboardingController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, filterPicker_1.default)(req.query, constants_1.paginationField);
    const filterOption = (0, filterPicker_1.default)(req.query, ["search"]);
    const employeeOnboarding = yield employee_onboarding_service_1.employeeOnboardingService.getAllEmployeeOnboardingService(paginationOptions, filterOption);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employeeOnboarding.result,
        meta: employeeOnboarding.meta,
        message: "data get successfully",
    });
}));
// get single data
const getEmployeeOnboardingController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const employeeOnboarding = yield employee_onboarding_service_1.employeeOnboardingService.getEmployeeOnboardingService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employeeOnboarding,
        message: "data get successfully",
    });
}));
// update data
const updateEmployeeOnboardingController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    yield employee_onboarding_service_1.employeeOnboardingService.updateEmployeeOnboardingService(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
    });
}));
// update onboarding task status
const updateOnboardingTaskStatusController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const taskName = req.params.taskName;
    yield employee_onboarding_service_1.employeeOnboardingService.updateOnboardingTaskStatusService(id, taskName);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "task status updated successfully",
    });
}));
// delete data
const deleteEmployeeOnboardingController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield employee_onboarding_service_1.employeeOnboardingService.deleteEmployeeOnboardingService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data deleted successfully",
    });
}));
// get all pending onboarding task
const getPendingOnboardingTaskController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pendingTask = yield employee_onboarding_service_1.employeeOnboardingService.getPendingOnboardingTaskService();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: pendingTask,
        message: "data get successfully",
    });
}));
exports.employeeOnboardingController = {
    getAllEmployeeOnboardingController,
    getEmployeeOnboardingController,
    updateEmployeeOnboardingController,
    updateOnboardingTaskStatusController,
    deleteEmployeeOnboardingController,
    getPendingOnboardingTaskController,
};
//# sourceMappingURL=employee-onboarding.controller.js.map