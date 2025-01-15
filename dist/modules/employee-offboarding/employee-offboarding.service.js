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
exports.employeeOffboardingService = void 0;
const paginationHelper_1 = require("../../lib/paginationHelper");
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
        $lookup: {
            from: "employees",
            localField: "employee_id",
            foreignField: "id",
            as: "employee",
        },
    }, {
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
            "employee.name": 1,
            "employee.image": 1,
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
exports.employeeOffboardingService = {
    getAllEmployeeOffboardingService,
    getEmployeeOffboardingService,
    updateEmployeeOffboardingService,
    updateOffboardingTaskStatusService,
    deleteEmployeeOffboardingService,
};
//# sourceMappingURL=employee-offboarding.service.js.map