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
exports.leaveService = void 0;
const dateConverter_1 = require("../../lib/dateConverter");
const paginationHelper_1 = require("../../lib/paginationHelper");
const employee_job_model_1 = require("../employee-job/employee-job.model");
const setting_service_1 = require("../setting/setting.service");
const leave_model_1 = require("./leave.model");
// get all data
const getAllLeaveService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { year } = filterOptions;
    if (!year) {
        throw new Error("Year is required");
    }
    // year filter
    const parsedYear = parseInt(year);
    if (isNaN(parsedYear)) {
        throw new Error("Year must be a valid number");
    }
    matchStage.$match.years = {
        $elemMatch: { year: parsedYear },
    };
    matchStage.$match.status = { $ne: "archived" };
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
        $project: {
            _id: 0,
            employee_id: 1,
            years: {
                $filter: {
                    input: "$years",
                    as: "year",
                    cond: { $eq: ["$$year.year", parsedYear] },
                },
            },
        },
    });
    const result = yield leave_model_1.Leave.aggregate(pipeline);
    // Transform the result to the desired format
    const transformedResult = result.flatMap((leave) => leave.years.map((yearData) => ({
        employee_id: leave.employee_id,
        year: yearData.year,
        casual: yearData.casual,
        earned: yearData.earned,
        sick: yearData.sick,
        without_pay: yearData.without_pay,
    })));
    const total = yield leave_model_1.Leave.countDocuments(matchStage.$match);
    return {
        result: transformedResult,
        meta: {
            total: total,
        },
    };
});
// get single data
const getLeaveService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield leave_model_1.Leave.findOne({ employee_id: id });
    return result;
});
// add new year data
const addNewYearLeaveService = (year) => __awaiter(void 0, void 0, void 0, function* () {
    if (!year || year < 1900 || year > 2100) {
        throw new Error("Valid year is required");
    }
    // Check if the year data already exists
    const existingYearData = yield leave_model_1.Leave.findOne({ "years.year": year });
    if (existingYearData) {
        return { message: "Year data already exists" };
    }
    const leaveAllottedDays = yield setting_service_1.settingService.getLeaveAllottedDays();
    const employees = yield employee_job_model_1.EmployeeJob.find({});
    if (employees.length === 0) {
        throw new Error("No employees found");
    }
    const bulkOperations = [];
    for (const employee of employees) {
        const createEmployeeLeaveData = {
            year: year,
            casual: {
                allotted: leaveAllottedDays.casual || 0,
                consumed: 0,
            },
            sick: {
                allotted: leaveAllottedDays.sick || 0,
                consumed: 0,
            },
            earned: {
                allotted: leaveAllottedDays.earned || 0,
                consumed: 0,
            },
            without_pay: {
                allotted: leaveAllottedDays.without_pay || 0,
                consumed: 0,
            },
        };
        const permanentDate = new Date(employee.permanent_date);
        const currentDate = new Date(`01-01-${year}`);
        if (!(0, dateConverter_1.isOneYearPassed)(permanentDate, currentDate)) {
            createEmployeeLeaveData.earned.allotted = 0;
        }
        const previousYearData = yield leave_model_1.Leave.findOne({
            employee_id: employee.employee_id,
            "years.year": year - 1,
        });
        if (previousYearData) {
            const previousYear = previousYearData.years.find((y) => y.year === year - 1);
            if (previousYear) {
                const carryOverEarned = previousYear.earned.allotted - previousYear.earned.consumed;
                createEmployeeLeaveData.earned.allotted += Math.max(0, carryOverEarned);
            }
        }
        bulkOperations.push({
            updateOne: {
                filter: { employee_id: employee.employee_id },
                update: { $push: { years: createEmployeeLeaveData } },
                upsert: true,
            },
        });
    }
    yield leave_model_1.Leave.bulkWrite(bulkOperations);
    return { message: "Year data added successfully" };
});
// update
const updateLeaveService = (id, year, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id || !year || !updateData) {
        throw new Error("Employee ID, year, and update data are required");
    }
    const result = yield leave_model_1.Leave.findOneAndUpdate({ employee_id: id, "years.year": year }, { $set: { "years.$": updateData } }, { new: true });
    if (!result) {
        throw new Error("Leave record not found");
    }
    return result;
});
// delete
const deleteLeaveService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new Error("Employee ID is required");
    }
    const result = yield leave_model_1.Leave.findOneAndDelete({ employee_id: id });
    if (!result) {
        throw new Error("Leave record not found");
    }
    return result;
});
exports.leaveService = {
    getAllLeaveService,
    getLeaveService,
    addNewYearLeaveService,
    updateLeaveService,
    deleteLeaveService,
};
//# sourceMappingURL=leave.service.js.map