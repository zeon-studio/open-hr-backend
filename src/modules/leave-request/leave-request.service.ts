import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
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
  const result = await LeaveRequest.create(data);
  return result;
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
