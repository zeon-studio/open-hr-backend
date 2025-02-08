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
exports.payrollService = void 0;
const dateConverter_1 = require("../../lib/dateConverter");
const mailSender_1 = require("../../lib/mailSender");
const paginationHelper_1 = require("../../lib/paginationHelper");
const mongoose_1 = __importDefault(require("mongoose"));
const employee_model_1 = require("../employee/employee.model");
const payroll_model_1 = require("./payroll.model");
// get all data
const getAllPayrollService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield payroll_model_1.Payroll.aggregate(pipeline);
    const total = yield payroll_model_1.Payroll.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getPayrollService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payroll_model_1.Payroll.findOne({ employee_id: id });
    return result;
});
// create monthly data
const createMonthlyPayrollService = (payData) => __awaiter(void 0, void 0, void 0, function* () {
    const salaryDate = (0, dateConverter_1.localDate)(new Date(payData.salary_date));
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if salaryDate already exists
        const existingPayroll = yield payroll_model_1.Payroll.findOne({
            "salary.date": salaryDate,
        }).session(session);
        if (existingPayroll) {
            throw new Error("Payroll data for this salary date already exists.");
        }
        const bulkOperations = payData.employees.map((data) => {
            const update = {
                $push: {
                    salary: {
                        amount: data.gross_salary,
                        date: salaryDate,
                    },
                },
            };
            if (data.bonus_amount) {
                update.$push.bonus = {
                    amount: data.bonus_amount,
                    type: data.bonus_type,
                    reason: data.bonus_reason,
                    date: salaryDate,
                };
            }
            return {
                updateOne: {
                    filter: { employee_id: data.employee_id },
                    update,
                    upsert: true,
                    new: true,
                },
            };
        });
        const result = yield payroll_model_1.Payroll.bulkWrite(bulkOperations, { session });
        // Send email to each employee
        for (const data of payData.employees) {
            const employee = yield employee_model_1.Employee.findOne({ id: data.employee_id }).session(session);
            if (employee) {
                yield mailSender_1.mailSender.salarySheet(employee.work_email, employee.name, payData.salary_date, data.gross_salary, data.bonus_type, data.bonus_amount);
            }
        }
        yield session.commitTransaction();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// update
const updatePayrollService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payroll_model_1.Payroll.findOneAndUpdate({ employee_id: id }, updateData, {
        new: true,
        upsert: true,
    });
    return result;
});
// delete
const deletePayrollService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield payroll_model_1.Payroll.findOneAndDelete({ employee_id: id });
});
exports.payrollService = {
    getAllPayrollService,
    getPayrollService,
    createMonthlyPayrollService,
    updatePayrollService,
    deletePayrollService,
};
//# sourceMappingURL=payroll.service.js.map