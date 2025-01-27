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
const constants_1 = require("../../config/constants");
const paginationHelper_1 = require("../../lib/paginationHelper");
const leave_model_1 = require("./leave.model");
// get all data
const getAllLeaveService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
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
// renew
const addNewYearLeaveService = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const createEmployeeLeaveData = {
        year: year,
        casual: {
            allotted: constants_1.leaveAllottedDays.casual,
            consumed: 0,
        },
        sick: {
            allotted: constants_1.leaveAllottedDays.sick,
            consumed: 0,
        },
        earned: {
            allotted: constants_1.leaveAllottedDays.earned,
            consumed: 0,
        },
        without_pay: {
            allotted: constants_1.leaveAllottedDays.without_pay,
            consumed: 0,
        },
    };
});
// update
const updateLeaveService = (id, year, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield leave_model_1.Leave.findOneAndUpdate({ employee_id: id, "years.year": year }, { $set: { "years.$": updateData } }, {
        new: true,
    });
    return result;
});
// delete
const deleteLeaveService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield leave_model_1.Leave.findOneAndDelete({ employee_id: id });
});
exports.leaveService = {
    getAllLeaveService,
    getLeaveService,
    addNewYearLeaveService,
    updateLeaveService,
    deleteLeaveService,
};
//# sourceMappingURL=leave.service.js.map