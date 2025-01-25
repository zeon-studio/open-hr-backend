import config from "@/config/variables";
import ApiError from "@/errors/ApiError";
import { localDate } from "@/lib/dateConverter";
import { dayCounterWithoutHoliday, leaveValidator } from "@/lib/leaveHelper";
import { mailSender } from "@/lib/mailSender";
import { leaveRequestDiscordTemplate } from "@/lib/mailTemplate";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import axios from "axios";
import mongoose, { PipelineStage } from "mongoose";
import { EmployeeJob } from "../employee-job/employee-job.model";
import { Employee } from "../employee/employee.model";
import { Leave } from "../leave/leave.model";
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
    const startDate = localDate(data.start_date);
    const endDate = localDate(data.end_date);
    const dayCount = await dayCounterWithoutHoliday(startDate, endDate);
    data = {
      ...data,
      start_date: startDate,
      end_date: endDate,
      day_count: dayCount,
    };
    const leaveData = await leaveValidator(data);
    const consumedDays = leaveData[data.leave_type].consumed;
    const allottedDays = leaveData[data.leave_type].allotted;

    if (consumedDays + dayCount > allottedDays) {
      throw new ApiError(
        `You have exceeded the maximum number of ${data.leave_type} days for this year`,
        400
      );
    } else {
      const postData = new LeaveRequest(data);
      await postData.save({ session });

      // deduct leave days
      const currentYear = startDate.getFullYear();
      await Leave.findOneAndUpdate(
        { employee_id: data.employee_id, "years.year": currentYear },
        {
          $inc: {
            [`years.$.${data.leave_type}.consumed`]: dayCount,
          },
        },
        { session }
      );

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
    throw new ApiError(error.message, 400);
  } finally {
    session.endSession();
  }
};

// update
const updateLeaveRequestService = async (
  id: string,
  updateData: LeaveRequestType
) => {
  const leaveReqData = await LeaveRequest.findOne({ _id: id });
  const employeeData = await Employee.findOne({
    id: leaveReqData?.employee_id,
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check status
    const leaveStatus = updateData.status;
    if (leaveStatus === "rejected") {
      // deduct leave days
      const currentYear = leaveReqData!.start_date.getFullYear();
      await Leave.findOneAndUpdate(
        { employee_id: leaveReqData!.employee_id, "years.year": currentYear },
        {
          $inc: {
            [`years.$.${leaveReqData!.leave_type}.consumed`]:
              -leaveReqData!.day_count,
          },
        },
        { session }
      );
    }

    await mailSender.leaveRequestResponse(
      employeeData?.work_email!,
      employeeData?.name!,
      leaveReqData?.leave_type!,
      leaveReqData?.day_count!,
      leaveReqData?.start_date!,
      leaveReqData?.end_date!,
      leaveReqData?.reason!,
      leaveStatus!
    );

    const result = await LeaveRequest.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
        session,
      }
    );

    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    console.log(error);
    throw new ApiError(error.message, 400);
  } finally {
    session.endSession();
  }
};

// delete
const deleteLeaveRequestService = async (id: string) => {
  await LeaveRequest.findOneAndDelete({ employee_id: id, status: "pending" });
};

// get upcoming leave request
const getUpcomingLeaveRequestService = async (current_date: Date) => {
  const leaveRequest = await LeaveRequest.find({
    status: "approved",
    start_date: { $gte: current_date },
  });
  return leaveRequest;
};

export const leaveRequestService = {
  getAllLeaveRequestService,
  getLeaveRequestService,
  createLeaveRequestService,
  updateLeaveRequestService,
  deleteLeaveRequestService,
  getUpcomingLeaveRequestService,
};
