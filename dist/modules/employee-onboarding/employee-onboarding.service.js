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
exports.employeeOnboardingService = void 0;
const paginationHelper_1 = require("../../lib/paginationHelper");
const employee_onboarding_model_1 = require("./employee-onboarding.model");
// get all data
const getAllEmployeeOnboardingService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
            add_fingerprint: 1,
            provide_id_card: 1,
            provide_appointment_letter: 1,
            provide_employment_contract: 1,
            provide_welcome_kit: 1,
            provide_devices: 1,
            provide_office_intro: 1,
            "employee.name": 1,
            "employee.image": 1,
        },
    });
    const result = yield employee_onboarding_model_1.EmployeeOnboarding.aggregate(pipeline);
    const total = yield employee_onboarding_model_1.EmployeeOnboarding.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getEmployeeOnboardingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_onboarding_model_1.EmployeeOnboarding.findOne({ employee_id: id });
    return result;
});
// add or update
const updateEmployeeOnboardingService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_onboarding_model_1.EmployeeOnboarding.findOneAndUpdate({ employee_id: id }, updateData, {
        new: true,
        upsert: true,
    });
    return result;
});
// update onboarding task status
const updateOnboardingTaskStatusService = (id, task) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_onboarding_model_1.EmployeeOnboarding.findOneAndUpdate({ employee_id: id }, { $set: { [`${task}.status`]: "completed" } }, {
        new: true,
    });
    return result;
});
// delete
const deleteEmployeeOnboardingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield employee_onboarding_model_1.EmployeeOnboarding.findOneAndDelete({ employee_id: id });
});
exports.employeeOnboardingService = {
    getAllEmployeeOnboardingService,
    getEmployeeOnboardingService,
    updateEmployeeOnboardingService,
    updateOnboardingTaskStatusService,
    deleteEmployeeOnboardingService,
};
//# sourceMappingURL=employee-onboarding.service.js.map