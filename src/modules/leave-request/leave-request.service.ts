import config from "@/config/variables";
import ApiError from "@/errors/ApiError";
import { dateConvert } from "@/lib/dateFormat";
import { leaveDataFinder, leaveDayCounter } from "@/lib/leaveHelper";
import { mailSender } from "@/lib/mailSender";
import { leaveRequestDiscordTemplate } from "@/lib/mailTemplate";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import axios from "axios";
import mongoose, { PipelineStage } from "mongoose";
import { EmployeeJob } from "../employee-job/employee-job.model";
import { Employee } from "../employee/employee.model";
import { LeaveRequest } from "./leave-request.model";
import {
  LeaveRequestFilterOptions,
  LeaveRequestType,
} from "./leave-request.type";

// get all data
const getAllLeaveRequestService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<LeaveRequestFilterOptions>
) => {
  let matchStage: any = {
    $match: {},
  };
  const { limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

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

  let pipeline: PipelineStage[] = [matchStage];

  pipeline.push({ $sort: { updatedAt: -1 } });

  if (skip) {
    pipeline.push({ $skip: skip });
  }
  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push(
    {
      $lookup: {
        from: "employees",
        localField: "user",
        foreignField: "id",
        as: "employee",
      },
    },
    {
      $project: {
        _id: 0,
        employee_id: 1,
        years: 1,
        "employee.name": 1,
        "employee.image": 1,
      },
    }
  );

  const result = await LeaveRequest.aggregate(pipeline);
  const total = await LeaveRequest.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getLeaveRequestService = async (id: string) => {
  const result = await LeaveRequest.findOne({ employee_id: id });
  return result;
};

// create
const createLeaveRequestService = async (data: LeaveRequestType) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const startDate = dateConvert(data.start_date);
    const endDate = dateConvert(data.end_date);
    const dayCount = await leaveDayCounter(startDate, endDate);
    data = {
      ...data,
      start_date: startDate,
      end_date: endDate,
      day_count: dayCount,
    };
    const leaveData = await leaveDataFinder(data);
    const consumedDays = leaveData[data.leave_type].consumed;
    const allottedDays = leaveData[data.leave_type].allotted;

    if (consumedDays + dayCount > allottedDays) {
      throw new Error(
        `You have exceeded the maximum number of ${data.leave_type} days for this year`
      );
    } else {
      const postData = new LeaveRequest(data);
      await postData.save({ session });

      // find employee data
      const employeeData = await Employee.findOne({
        id: data.employee_id,
      }).session(session);

      // find employee manager
      const employeeJobData = await EmployeeJob.findOne({
        employee_id: data.employee_id,
      }).session(session);

      // find manager email
      const managerData = await Employee.findOne({
        id: employeeJobData?.manager_id,
      }).session(session);

      // find admin and moderator data
      const adminAndModData = await Employee.find({
        role: { $in: ["admin", "moderator"] },
      }).session(session);

      // find admin and moderator email
      const adminAndModEmails = adminAndModData.map((data) => data.work_email);

      // create an array of emails
      const notifyEmailList = [...adminAndModEmails, managerData?.work_email!];

      // send mail
      await mailSender.leaveRequest(
        notifyEmailList,
        employeeData?.name!,
        data.leave_type,
        dayCount,
        startDate,
        endDate,
        data.reason
      );

      // send discord message
      await axios.post(config.discord_webhook_url!, {
        content: leaveRequestDiscordTemplate(
          employeeData?.name!,
          data.leave_type,
          dayCount,
          startDate,
          endDate,
          data.reason
        ),
      });

      await session.commitTransaction();
      return postData;
    }
  } catch (error: any) {
    await session.abortTransaction();
    console.log(error);
    throw new ApiError(error.message, 400, "");
  } finally {
    session.endSession();
  }
};

// update
const updateLeaveRequestService = async (
  id: string,
  updateData: LeaveRequestType
) => {
  const result = await LeaveRequest.findOneAndUpdate(
    { employee_id: id },
    updateData,
    {
      new: true,
    }
  );
  return result;
};

// delete
const deleteLeaveRequestService = async (id: string) => {
  await LeaveRequest.findOneAndDelete({ employee_id: id });
};

export const leaveRequestService = {
  getAllLeaveRequestService,
  getLeaveRequestService,
  createLeaveRequestService,
  updateLeaveRequestService,
  deleteLeaveRequestService,
};
