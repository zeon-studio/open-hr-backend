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
const paginationHelper_1 = require("../../lib/paginationHelper");
const employee_job_model_1 = require("./employee-job.model");
// get all data
const getAllEmployeeJobService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search, designation } = filterOptions;
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [{ employee_id: { $regex: keyword, $options: "i" } }],
        }));
        matchStage.$match.$or = searchConditions;
    }
    // designation condition
    if (designation) {
        matchStage.$match.designation = designation;
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
            job_type: 1,
            joining_date: 1,
            designation: 1,
            department: 1,
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
    const job = yield employee_job_model_1.EmployeeJob.findOne({ platform: id });
    if (job) {
        // Update existing jobs or add new ones
        updateData.prev_jobs.forEach((newJob) => {
            const existingJobIndex = job.prev_jobs.findIndex((job) => job.company_name === newJob.company_name);
            if (existingJobIndex !== -1) {
                // Update existing job
                job.prev_jobs[existingJobIndex] = Object.assign(Object.assign({}, job.prev_jobs[existingJobIndex]), newJob);
            }
            else {
                // Add new job
                job.prev_jobs.push(newJob);
            }
        });
        yield job.save();
        return job;
    }
    else {
        // Create new job if it doesn't exist
        const newEmployeeJob = new employee_job_model_1.EmployeeJob(updateData);
        yield newEmployeeJob.save();
        return newEmployeeJob;
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