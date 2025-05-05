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
exports.employeeOffboardingService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const mailSender_1 = require("../../lib/mailSender");
const paginationHelper_1 = require("../../lib/paginationHelper");
const mongoose_1 = __importDefault(require("mongoose"));
const employee_job_model_1 = require("../employee-job/employee-job.model");
const employee_model_1 = require("../employee/employee.model");
const leave_model_1 = require("../leave/leave.model");
const payroll_model_1 = require("../payroll/payroll.model");
const setting_service_1 = require("../setting/setting.service");
const employee_offboarding_model_1 = require("./employee-offboarding.model");
// get all data
const getAllEmployeeOffboardingService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search } = filterOptions;
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [{ employee_id: { $regex: keyword, $options: "i" } }],
        }));
        matchStage.$match.$or = searchConditions;
    }
    let pipeline = [matchStage];
    pipeline.push({ $sort: { createdAt: -1 } });
    if (skip) {
        pipeline.push({ $skip: skip });
    }
    if (limit) {
        pipeline.push({ $limit: limit });
    }
    pipeline.push({
        $project: {
            _id: 0,
            employee_id: 1,
            tasks: 1,
        },
    });
    const result = yield employee_offboarding_model_1.EmployeeOffboarding.aggregate(pipeline);
    const total = yield employee_offboarding_model_1.EmployeeOffboarding.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getEmployeeOffboardingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_offboarding_model_1.EmployeeOffboarding.findOne({ employee_id: id });
    return result;
});
// create
const createEmployeeOffboardingService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const employeeData = yield employee_model_1.Employee.findOne({
            id: data.employee_id,
        }, null, { session });
        // update employee status
        yield employee_model_1.Employee.findOneAndUpdate({ id: data.employee_id }, { $set: { status: "archived", role: "former" } }, { session });
        // update resignation date on employee job
        yield employee_job_model_1.EmployeeJob.findOneAndUpdate({ employee_id: data.employee_id }, { $set: { resignation_date: data.resignation_date } }, { session });
        // update payroll status
        yield payroll_model_1.Payroll.findOneAndUpdate({ employee_id: data.employee_id }, { $set: { status: "archived" } }, { session });
        // update employee leave status
        yield leave_model_1.Leave.findOneAndUpdate({ employee_id: data.employee_id }, { $set: { status: "archived" } }, { session });
        const offboardingTasks = yield setting_service_1.settingService.getOffboardingTasksService();
        const createEmployeeOffboardingData = {
            employee_id: data.employee_id,
            tasks: offboardingTasks.map((task) => ({
                task_name: task.name,
                assigned_to: task.assigned_to,
                status: "pending",
            })),
        };
        const result = yield employee_offboarding_model_1.EmployeeOffboarding.create([createEmployeeOffboardingData], { session });
        yield mailSender_1.mailSender.offboardingInitiate((employeeData === null || employeeData === void 0 ? void 0 : employeeData.personal_email) || (employeeData === null || employeeData === void 0 ? void 0 : employeeData.work_email), employeeData === null || employeeData === void 0 ? void 0 : employeeData.name, data.resignation_date);
        yield session.commitTransaction();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new ApiError_1.default(error.message, 400);
    }
    finally {
        session.endSession();
    }
});
// update
const updateEmployeeOffboardingService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_offboarding_model_1.EmployeeOffboarding.findOneAndUpdate({ employee_id: id }, updateData, {
        new: true,
        upsert: true,
    });
    return result;
});
// update onboarding task status
const updateOffboardingTaskStatusService = (id, taskName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_offboarding_model_1.EmployeeOffboarding.findOneAndUpdate({ employee_id: id, "tasks.task_name": taskName }, { $set: { "tasks.$.status": "completed" } }, {
        new: true,
    });
    return result;
});
// delete
const deleteEmployeeOffboardingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield employee_offboarding_model_1.EmployeeOffboarding.findOneAndDelete({ employee_id: id });
});
// get all pending offboarding task
const getPendingOffboardingTaskService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_offboarding_model_1.EmployeeOffboarding.aggregate([
        {
            $unwind: "$tasks",
        },
        {
            $match: {
                "tasks.status": "pending",
            },
        },
        {
            $project: {
                _id: 0,
                employee_id: 1,
                createdAt: 1,
                task_name: "$tasks.task_name",
                assigned_to: "$tasks.assigned_to",
                status: "$tasks.status",
            },
        },
    ]);
    return result;
});
exports.employeeOffboardingService = {
    getAllEmployeeOffboardingService,
    getEmployeeOffboardingService,
    createEmployeeOffboardingService,
    updateEmployeeOffboardingService,
    updateOffboardingTaskStatusService,
    deleteEmployeeOffboardingService,
    getPendingOffboardingTaskService,
};
//# sourceMappingURL=employee-offboarding.service.js.map