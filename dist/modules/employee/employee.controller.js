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
exports.employeeController = void 0;
const constants_1 = require("../../config/constants");
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const filterPicker_1 = __importDefault(require("../../lib/filterPicker"));
const sendResponse_1 = require("../../lib/sendResponse");
const employee_service_1 = require("./employee.service");
// get all employees
const getAllEmployeeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract pagination options
    const paginationOptions = (0, filterPicker_1.default)(req.query, constants_1.paginationField);
    // Extract filter options
    let filterOptions = (0, filterPicker_1.default)(req.query, ["search", "status"]);
    // Convert 'status' to array if it exists
    if (filterOptions.status && typeof filterOptions.status === "string") {
        filterOptions.status = filterOptions.status.split(",");
    }
    const employee = yield employee_service_1.employeeService.getAllEmployeeService(paginationOptions, filterOptions);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employee.result,
        meta: employee.meta,
        message: "data get successfully",
    });
}));
// get all employees id
const getAllEmployeeBasicsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield employee_service_1.employeeService.getAllEmployeeBasicsService();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employee,
        message: "data get successfully",
    });
}));
// get single employee
const getSingleEmployeeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield employee_service_1.employeeService.getSingleEmployeeService(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employee,
        message: "employee get successfully",
    });
}));
// get single employee by invite token
const getSingleEmployeeByInviteTokenController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield employee_service_1.employeeService.getSingleEmployeeByInviteTokenService(req.params.inviteToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employee,
        message: "employee get successfully",
    });
}));
// get admin and mods
const getAdminAndModsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield employee_service_1.employeeService.getAdminAndModsService();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employee,
        message: "employee get successfully",
    });
}));
// insert employee
const createEmployeeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = req.body;
    const employeeData = yield employee_service_1.employeeService.createEmployeeService(employee);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "data inserted successfully",
        result: employeeData,
    });
}));
// update controller
const updateEmployeeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeData = req.body;
    const updateData = yield employee_service_1.employeeService.updateEmployeeService(employeeData, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
        result: updateData,
    });
}));
// update employee email
const updateEmployeeEmailController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const updateEmail = yield employee_service_1.employeeService.updateEmployeeEmailService(email, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
        result: updateEmail,
    });
}));
// update employee password
const updateEmployeePasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const updatePassword = yield employee_service_1.employeeService.updateEmployeePasswordService(password, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
        result: updatePassword,
    });
}));
// update employee communication_id
const updateEmployeeCommunicationIdController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const communication_id = req.body.communication_id;
    const updateCommunicationId = yield employee_service_1.employeeService.updateEmployeeCommunicationIdService(communication_id, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
        result: updateCommunicationId,
    });
}));
// update employee personality
const updateEmployeePersonalityController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const personality = req.body.personality;
    const updatePersonality = yield employee_service_1.employeeService.updateEmployeePersonalityService(personality, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
        result: updatePersonality,
    });
}));
// update employee role
const updateEmployeeRoleController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.body.role;
    const updateRole = yield employee_service_1.employeeService.updateEmployeeRoleService(req.params.id, role);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
        result: updateRole,
    });
}));
// delete showcase
const deleteEmployeeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deleteEmployee = yield employee_service_1.employeeService.deleteEmployeeService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "data deleted successfully",
        result: deleteEmployee,
    });
}));
exports.employeeController = {
    getAllEmployeeController,
    getAllEmployeeBasicsController,
    getSingleEmployeeController,
    getSingleEmployeeByInviteTokenController,
    getAdminAndModsController,
    createEmployeeController,
    updateEmployeeController,
    updateEmployeeEmailController,
    updateEmployeePasswordController,
    updateEmployeeCommunicationIdController,
    updateEmployeePersonalityController,
    updateEmployeeRoleController,
    deleteEmployeeController,
};
//# sourceMappingURL=employee.controller.js.map