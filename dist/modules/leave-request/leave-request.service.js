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
exports.leaveRequestService = void 0;
const variables_1 = __importDefault(require("../../config/variables"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const dateConverter_1 = require("../../lib/dateConverter");
const leaveHelper_1 = require("../../lib/leaveHelper");
const mailSender_1 = require("../../lib/mailSender");
const mailTemplate_1 = require("../../lib/mailTemplate");
const paginationHelper_1 = require("../../lib/paginationHelper");
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const employee_job_model_1 = require("../employee-job/employee-job.model");
const employee_model_1 = require("../employee/employee.model");
const leave_model_1 = require("../leave/leave.model");
const leave_request_model_1 = require("./leave-request.model");
// get all data
const getAllLeaveRequestService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
            $or: [
                { employee_id: { $regex: keyword, $options: "i" } },
                { reason: { $regex: keyword, $options: "i" } },
            ],
        }));
        matchStage.$match.$or = searchConditions;
    }
    // employee_id condition
    if (employee_id) {
        matchStage.$match.employee_id = employee_id;
    }
    let pipeline = [matchStage];
    pipeline.push({
        $addFields: {
            isPending: {
                $cond: { if: { $eq: ["$status", "pending"] }, then: 1, else: 0 },
            },
        },
    });
    pipeline.push({
        $sort: {
            isPending: -1,
            createdAt: -1,
        },
    });
    pipeline.push({
        $project: {
            isPending: 0,
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
            _id: 1,
            employee_id: 1,
            leave_type: 1,
            start_date: 1,
            end_date: 1,
            day_count: 1,
            reason: 1,
            status: 1,
        },
    });
    const result = yield leave_request_model_1.LeaveRequest.aggregate(pipeline);
    const total = yield leave_request_model_1.LeaveRequest.countDocuments(matchStage.$match);
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single employee data
const getLeaveRequestService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield leave_request_model_1.LeaveRequest.find({ employee_id: id }).sort({
        createdAt: -1,
    });
    return result;
});
// create
const createLeaveRequestService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const startDate = (0, dateConverter_1.localDate)(new Date(data.start_date));
        const endDate = (0, dateConverter_1.localDate)(new Date(data.end_date));
        const dayCount = yield (0, leaveHelper_1.dayCounterWithoutHoliday)(startDate, endDate);
        data = Object.assign(Object.assign({}, data), { start_date: startDate, end_date: endDate, day_count: dayCount });
        const leaveData = yield (0, leaveHelper_1.leaveValidator)(data);
        const consumedDays = leaveData[data.leave_type].consumed;
        const allottedDays = leaveData[data.leave_type].allotted;
        if (consumedDays + dayCount > allottedDays) {
            throw new ApiError_1.default(`You have exceeded the maximum number of ${data.leave_type} days for this year`, 400);
        }
        else {
            const postData = new leave_request_model_1.LeaveRequest(data);
            yield postData.save({ session });
            // deduct leave days
            const currentYear = startDate.getFullYear();
            yield leave_model_1.Leave.findOneAndUpdate({ employee_id: data.employee_id, "years.year": currentYear }, {
                $inc: {
                    [`years.$.${data.leave_type}.consumed`]: dayCount,
                },
            }, { session });
            // find employee data
            const employeeData = yield employee_model_1.Employee.findOne({
                id: data.employee_id,
            }).session(session);
            // find employee manager
            const employeeJobData = yield employee_job_model_1.EmployeeJob.findOne({
                employee_id: data.employee_id,
            }).session(session);
            // find manager email
            const managerData = yield employee_model_1.Employee.findOne({
                id: employeeJobData === null || employeeJobData === void 0 ? void 0 : employeeJobData.manager_id,
            }).session(session);
            // find admin and moderator data
            const adminAndModData = yield employee_model_1.Employee.find({
                role: { $in: ["admin", "moderator"] },
            }).session(session);
            // find admin and moderator email
            const adminAndModEmails = adminAndModData.map((data) => data.work_email);
            // create an array of emails
            const notifyEmailList = [...adminAndModEmails, managerData === null || managerData === void 0 ? void 0 : managerData.work_email];
            // send mail
            yield mailSender_1.mailSender.leaveRequest(notifyEmailList, employeeData === null || employeeData === void 0 ? void 0 : employeeData.name, data.leave_type, dayCount, startDate, endDate, data.reason);
            // send discord message
            if (variables_1.default.discord_webhook_url) {
                try {
                    yield axios_1.default.post(variables_1.default.discord_webhook_url, {
                        content: (0, mailTemplate_1.leaveRequestDiscordTemplate)(employeeData === null || employeeData === void 0 ? void 0 : employeeData.name, data.leave_type, dayCount, startDate, endDate, data.reason),
                    });
                }
                catch (discordError) {
                    if (discordError.response && discordError.response.status === 429) {
                        // Discord rate limit error
                        console.warn("Discord webhook rate limit exceeded. Skipping Discord notification.");
                    }
                    else {
                        // Log other errors but do not block leave request creation
                        console.warn("Failed to send Discord notification:", discordError.message);
                    }
                }
            }
            yield session.commitTransaction();
            return postData;
        }
    }
    catch (error) {
        yield session.abortTransaction();
        console.log(error);
        throw new ApiError_1.default(error.message, 400);
    }
    finally {
        session.endSession();
    }
});
// update
const updateLeaveRequestService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const leaveReqData = yield leave_request_model_1.LeaveRequest.findOne({ _id: id });
    const employeeData = yield employee_model_1.Employee.findOne({
        id: leaveReqData === null || leaveReqData === void 0 ? void 0 : leaveReqData.employee_id,
    });
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // check status
        const leaveStatus = updateData.status;
        if (leaveStatus === "rejected") {
            // deduct leave days
            const currentYear = leaveReqData.start_date.getFullYear();
            yield leave_model_1.Leave.findOneAndUpdate({ employee_id: leaveReqData.employee_id, "years.year": currentYear }, {
                $inc: {
                    [`years.$.${leaveReqData.leave_type}.consumed`]: -leaveReqData.day_count,
                },
            }, { session });
        }
        yield mailSender_1.mailSender.leaveRequestResponse(employeeData === null || employeeData === void 0 ? void 0 : employeeData.work_email, employeeData === null || employeeData === void 0 ? void 0 : employeeData.name, leaveReqData === null || leaveReqData === void 0 ? void 0 : leaveReqData.leave_type, leaveReqData === null || leaveReqData === void 0 ? void 0 : leaveReqData.day_count, leaveReqData === null || leaveReqData === void 0 ? void 0 : leaveReqData.start_date, leaveReqData === null || leaveReqData === void 0 ? void 0 : leaveReqData.end_date, leaveReqData === null || leaveReqData === void 0 ? void 0 : leaveReqData.reason, leaveStatus);
        const result = yield leave_request_model_1.LeaveRequest.findOneAndUpdate({ _id: id }, updateData, {
            new: true,
            session,
        });
        yield session.commitTransaction();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        console.log(error);
        throw new ApiError_1.default(error.message, 400);
    }
    finally {
        session.endSession();
    }
});
// delete
const deleteLeaveRequestService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const leaveReqData = yield leave_request_model_1.LeaveRequest.findOne({ _id: id }).session(session);
        // deduct leave days
        const currentYear = leaveReqData.start_date.getFullYear();
        yield leave_model_1.Leave.findOneAndUpdate({ employee_id: leaveReqData.employee_id, "years.year": currentYear }, {
            $inc: {
                [`years.$.${leaveReqData.leave_type}.consumed`]: -leaveReqData.day_count,
            },
        }, { session });
        yield leave_request_model_1.LeaveRequest.findOneAndDelete({ _id: id, status: "pending" }).session(session);
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        console.log(error);
        throw new ApiError_1.default(error.message, 400);
    }
    finally {
        session.endSession();
    }
});
// get upcoming leave request
const getUpcomingLeaveRequestService = (current_date) => __awaiter(void 0, void 0, void 0, function* () {
    const leaveRequest = yield leave_request_model_1.LeaveRequest.find({
        status: { $in: ["approved", "pending"] },
        end_date: { $gte: current_date },
    }).sort({ start_date: 1 });
    return leaveRequest;
});
// get upcoming leave request individual date
const getUpcomingLeaveRequestDatesService = (current_date) => __awaiter(void 0, void 0, void 0, function* () {
    const leaveRequest = yield leave_request_model_1.LeaveRequest.find({
        status: { $in: ["approved", "pending"] },
        start_date: { $gte: current_date },
    });
    return leaveRequest
        .map((data) => {
        const dates = [];
        let currentDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    })
        .flat();
});
exports.leaveRequestService = {
    getAllLeaveRequestService,
    getLeaveRequestService,
    createLeaveRequestService,
    updateLeaveRequestService,
    deleteLeaveRequestService,
    getUpcomingLeaveRequestService,
    getUpcomingLeaveRequestDatesService,
};
//# sourceMappingURL=leave-request.service.js.map