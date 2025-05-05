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
exports.employeeJobService = void 0;
const dateConverter_1 = require("../../lib/dateConverter");
const paginationHelper_1 = require("../../lib/paginationHelper");
const employee_model_1 = require("../employee/employee.model");
const employee_job_model_1 = require("./employee-job.model");
// get all data
const getAllEmployeeJobService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
            job_type: 1,
            joining_date: 1,
            manager_id: 1,
            permanent_date: 1,
            company_name: 1,
            company_website: 1,
            resignation_date: 1,
            prev_jobs: 1,
            promotions: 1,
            note: 1,
        },
    });
    const result = yield employee_job_model_1.EmployeeJob.aggregate(pipeline);
    const total = yield employee_job_model_1.EmployeeJob.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getEmployeeJobService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_job_model_1.EmployeeJob.findOne({ employee_id: id });
    return result;
});
// update
const updateEmployeeJobService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert dates to local dates
        if (updateData.joining_date) {
            updateData.joining_date = (0, dateConverter_1.localDate)(new Date(updateData.joining_date));
        }
        if (updateData.permanent_date) {
            updateData.permanent_date = (0, dateConverter_1.localDate)(new Date(updateData.permanent_date));
        }
        if (updateData.resignation_date) {
            updateData.resignation_date = (0, dateConverter_1.localDate)(new Date(updateData.resignation_date));
        }
        if (updateData.promotions) {
            updateData.promotions = updateData.promotions.map((promotion) => (Object.assign(Object.assign({}, promotion), { promotion_date: (0, dateConverter_1.localDate)(new Date(promotion.promotion_date)) })));
        }
        if (updateData.prev_jobs) {
            updateData.prev_jobs = updateData.prev_jobs.map((prevJob) => (Object.assign(Object.assign({}, prevJob), { start_date: (0, dateConverter_1.localDate)(new Date(prevJob.start_date)), end_date: (0, dateConverter_1.localDate)(new Date(prevJob.end_date)) })));
        }
        // update employee designation on employee data
        const employee = yield employee_model_1.Employee.findOne({ id });
        if (employee && updateData.promotions && updateData.promotions.length > 0) {
            // Find the latest promotion by date
            const latestPromotion = updateData.promotions.reduce((latest, current) => {
                const latestDate = new Date(latest.promotion_date);
                const currentDate = new Date(current.promotion_date);
                return currentDate > latestDate ? current : latest;
            });
            employee.designation = latestPromotion.designation;
            yield employee.save();
        }
        // update employee job data
        const result = yield employee_job_model_1.EmployeeJob.findOneAndUpdate({ employee_id: id }, { $set: updateData }, {
            new: true,
            upsert: true,
        });
        return result;
    }
    catch (error) {
        console.error("Error in updateEmployeeJobService:", error);
        throw error;
    }
});
// delete
const deleteEmployeeJobService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield employee_job_model_1.EmployeeJob.findOneAndDelete({ employee_id: id });
});
exports.employeeJobService = {
    getAllEmployeeJobService,
    getEmployeeJobService,
    deleteEmployeeJobService,
    updateEmployeeJobService,
};
//# sourceMappingURL=employee-job.service.js.map