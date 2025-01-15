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
const paginationHelper_1 = require("../../lib/paginationHelper");
const leave_model_1 = require("./leave.model");
// get all data
const getAllLeaveService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search, employee_id } = filterOptions;
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [{ name: { $regex: keyword, $options: "i" } }],
        }));
        matchStage.$match.$or = searchConditions;
    }
    // employee_id condition
    if (employee_id) {
        matchStage.$match.employee_id = employee_id;
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
        $lookup: {
            from: "employees",
            localField: "user",
            foreignField: "id",
            as: "employee",
        },
    }, {
        $project: {
            _id: 0,
            employee_id: 1,
            years: 1,
            "employee.name": 1,
            "employee.image": 1,
        },
    });
    const result = yield leave_model_1.Leave.aggregate(pipeline);
    const total = yield leave_model_1.Leave.countDocuments();
    return {
        result: result,
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
// create
const createLeaveService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield leave_model_1.Leave.create(data);
    return result;
});
// update
const updateLeaveService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield leave_model_1.Leave.findOneAndUpdate({ employee_id: id }, updateData, {
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
    createLeaveService,
    updateLeaveService,
    deleteLeaveService,
};
//# sourceMappingURL=leave.service.js.map