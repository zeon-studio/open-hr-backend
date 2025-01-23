import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { Leave } from "./leave.model";
import { LeaveFilterOptions, LeaveType } from "./leave.type";

// get all data
const getAllLeaveService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<LeaveFilterOptions>
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

  pipeline.push({
    $project: {
      _id: 0,
      employee_id: 1,
      years: 1,
    },
  });

  const result = await Leave.aggregate(pipeline);
  const total = await Leave.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getLeaveService = async (id: string) => {
  const result = await Leave.findOne({ employee_id: id });
  return result;
};

// create
const createLeaveService = async (data: LeaveType) => {
  const result = await Leave.create(data);
  return result;
};

// update
const updateLeaveService = async (id: string, updateData: LeaveType) => {
  const result = await Leave.findOneAndUpdate({ employee_id: id }, updateData, {
    new: true,
  });
  return result;
};

// delete
const deleteLeaveService = async (id: string) => {
  await Leave.findOneAndDelete({ employee_id: id });
};

export const leaveService = {
  getAllLeaveService,
  getLeaveService,
  createLeaveService,
  updateLeaveService,
  deleteLeaveService,
};
