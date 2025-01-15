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
exports.employeeService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const IdGenerator_1 = require("../../lib/IdGenerator");
const mailSender_1 = require("../../lib/mailSender");
const paginationHelper_1 = require("../../lib/paginationHelper");
const http_status_1 = __importDefault(require("http-status"));
const employee_job_model_1 = require("../employee-job/employee-job.model");
const employee_model_1 = require("./employee.model");
// get all employees
const getAllEmployeeService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search, department } = filterOptions;
    // Create a text search stage for multiple fields
    let matchStage = {
        $match: {},
    };
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [
                { work_email: { $regex: keyword, $options: "i" } },
                { name: { $regex: keyword, $options: "i" } },
            ],
        }));
        matchStage.$match.$or = searchConditions;
    }
    // department condition
    if (department) {
        matchStage.$match.department = department;
    }
    let pipeline = [matchStage];
    // Sorting stage
    pipeline.push({
        $sort: {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        },
    });
    if (skip) {
        pipeline.push({ $skip: skip });
    }
    if (limit) {
        pipeline.push({ $limit: limit });
    }
    pipeline.push({
        $lookup: {
            from: "employee_personas",
            localField: "id",
            foreignField: "id",
            as: "persona",
        },
    }, {
        $project: {
            id: 1,
            name: 1,
            image: 1,
            createdAt: 1,
            "persona.image": 1,
        },
    });
    // Reapply sorting after grouping
    pipeline.push({
        $sort: {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        },
    });
    // result
    const result = yield employee_model_1.Employee.aggregate(pipeline);
    const total = yield employee_model_1.Employee.countDocuments(matchStage.$match);
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single employee
const getSingleEmployeeService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield employee_model_1.Employee.aggregate([
        {
            $match: { id: id },
        },
        {
            $lookup: {
                from: "employee_personas",
                localField: "id",
                foreignField: "id",
                as: "persona",
            },
        },
        {
            $project: {
                id: 1,
                name: 1,
                image: 1,
                createdAt: 1,
                "persona.image": 1,
            },
        },
    ]);
    return employee[0];
});
// insert employee
const createEmployeeService = (employeeData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield employee_model_1.Employee.startSession();
    session.startTransaction();
    try {
        // count data by department
        const departmentSerial = (yield employee_model_1.Employee.countDocuments({ department: employeeData.department })) +
            1;
        const employeeId = (0, IdGenerator_1.generateEmployeeId)(employeeData.department, employeeData.joining_date, departmentSerial);
        const createEmployeeData = {
            id: employeeId,
            department: employeeData.department,
            personal_email: employeeData.personal_email,
        };
        const createEmployeeJobData = {
            employee_id: employeeId,
            job_type: employeeData.job_type,
            designation: employeeData.designation,
            joining_date: employeeData.joining_date,
        };
        const newEmployeeData = new employee_model_1.Employee(createEmployeeData);
        const insertedEmployee = yield newEmployeeData.save({ session });
        const newEmployeeJobData = new employee_job_model_1.EmployeeJob(createEmployeeJobData);
        yield newEmployeeJobData.save({ session });
        yield mailSender_1.mailSender.invitationRequest(employeeData.personal_email, employeeData.designation, employeeData.joining_date);
        yield session.commitTransaction();
        session.endSession();
        return insertedEmployee;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// update
const updateEmployeeService = (updatedData, id) => __awaiter(void 0, void 0, void 0, function* () {
    // const employee = await Employee.findOne({ id });
    // if (
    //   employee?.image !== updatedData.image &&
    //   employee?.image &&
    //   !employee.image.startsWith("http")
    // ) {
    //   await deleteFile(employee?.image);
    // }
    const result = yield employee_model_1.Employee.findOneAndUpdate({ id: id }, updatedData, {
        new: true,
    });
    return result;
});
// update employee note
const updateEmployeeNoteService = (note, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_model_1.Employee.findOneAndUpdate({ id: id }, { note }, {
        new: true,
    });
    return result;
});
// delete employee
const deleteEmployeeService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteEmployee = yield employee_model_1.Employee.findOneAndDelete({ id: id }, { new: true });
        if (!deleteEmployee) {
            throw new ApiError_1.default("employee is not delete", http_status_1.default.FORBIDDEN, "");
        }
    }
    catch (error) {
        throw new ApiError_1.default("employee is not delete", http_status_1.default.FORBIDDEN, "");
    }
});
exports.employeeService = {
    getAllEmployeeService,
    createEmployeeService,
    getSingleEmployeeService,
    updateEmployeeService,
    updateEmployeeNoteService,
    deleteEmployeeService,
};
//# sourceMappingURL=employee.service.js.map