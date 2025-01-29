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
const constants_1 = require("../../config/constants");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const mailSender_1 = require("../../lib/mailSender");
const paginationHelper_1 = require("../../lib/paginationHelper");
const mongoose_1 = __importDefault(require("mongoose"));
const employee_job_model_1 = require("../employee-job/employee-job.model");
const employee_model_1 = require("../employee/employee.model");
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
    pipeline.push({ $sort: { updatedAt: -1 } });
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
            remove_fingerprint: 1,
            task_handover: 1,
            collect_id_card: 1,
            collect_email: 1,
            collect_devices: 1,
            nda_agreement: 1,
            provide_certificate: 1,
            farewell: 1,
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
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const employeeData = yield employee_model_1.Employee.findOne({
            id: data.employee_id,
        }, null, { session });
        // update employee status
        yield employee_model_1.Employee.findOneAndUpdate({ employee_id: data.employee_id }, { $set: { status: "archived" } }, { session });
        // update resignation date on employee job
        yield employee_job_model_1.EmployeeJob.findOneAndUpdate({ employee_id: data.employee_id }, { $set: { resignation_date: data.resignation_date } }, { session });
        const createEmployeeOffboardingData = {
            employee_id: data.employee_id,
            remove_fingerprint: {
                task_name: "Remove Fingerprint",
                assigned_to: constants_1.offboardingTasks.remove_fingerprint,
                status: "pending",
            },
            task_handover: {
                task_name: "Handover Tasks",
                assigned_to: constants_1.offboardingTasks.task_handover,
                status: "pending",
            },
            collect_id_card: {
                task_name: "Collect ID Card",
                assigned_to: constants_1.offboardingTasks.collect_id_card,
                status: "pending",
            },
            collect_email: {
                task_name: "Collect Email Credentials",
                assigned_to: constants_1.offboardingTasks.collect_email,
                status: "pending",
            },
            collect_devices: {
                task_name: "Collect Devices",
                assigned_to: constants_1.offboardingTasks.collect_devices,
                status: "pending",
            },
            nda_agreement: {
                task_name: "Provide NDA",
                assigned_to: constants_1.offboardingTasks.nda_agreement,
                status: "pending",
            },
            provide_certificate: {
                task_name: "Provide Certificate",
                assigned_to: constants_1.offboardingTasks.provide_certificate,
                status: "pending",
            },
            farewell: {
                task_name: "Farewell",
                assigned_to: constants_1.offboardingTasks.farewell,
                status: "pending",
            },
        };
        const result = yield employee_offboarding_model_1.EmployeeOffboarding.create([createEmployeeOffboardingData], { session });
        yield mailSender_1.mailSender.offboardingInitiate((_a = employeeData === null || employeeData === void 0 ? void 0 : employeeData.personal_email) !== null && _a !== void 0 ? _a : employeeData === null || employeeData === void 0 ? void 0 : employeeData.work_email, employeeData === null || employeeData === void 0 ? void 0 : employeeData.name, data.resignation_date);
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
const updateOffboardingTaskStatusService = (id, task) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_offboarding_model_1.EmployeeOffboarding.findOneAndUpdate({ employee_id: id }, { $set: { [`${task}.status`]: "completed" } }, {
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
    const pendingTasks = [
        "remove_fingerprint",
        "task_handover",
        "collect_id_card",
        "collect_email",
        "collect_devices",
        "nda_agreement",
        "provide_certificate",
        "farewell",
    ];
    const matchConditions = pendingTasks.map((task) => ({
        [`${task}.status`]: "pending",
    }));
    const projectFields = pendingTasks.reduce((acc, task) => {
        acc[task] = {
            $cond: {
                if: { $eq: [`$${task}.status`, "pending"] },
                then: {
                    $mergeObjects: [
                        `$${task}`,
                        {
                            employee_id: "$employee_id",
                            createdAt: "$createdAt",
                            task_id: task,
                        },
                    ],
                },
                else: "$$REMOVE",
            },
        };
        return acc;
    }, {});
    const result = yield employee_offboarding_model_1.EmployeeOffboarding.aggregate([
        {
            $match: {
                $or: matchConditions,
            },
        },
        {
            $project: Object.assign({ _id: 0 }, projectFields),
        },
    ]);
    // Flatten the result array
    const flattenedResult = result.reduce((acc, item) => {
        pendingTasks.forEach((task) => {
            if (item[task]) {
                acc.push(item[task]);
            }
        });
        return acc;
    }, []);
    return flattenedResult;
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