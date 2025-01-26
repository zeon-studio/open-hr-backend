import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { Leave } from "./leave.model";
import { LeaveFilterOptions, LeaveType, LeaveYear } from "./leave.type";

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
  const { year } = filterOptions;
  if (!year) {
    throw new Error("Year is required");
  }

  // year filter
  const parsedYear = parseInt(year);
  if (isNaN(parsedYear)) {
    throw new Error("Year must be a valid number");
  }

  matchStage.$match.years = {
    $elemMatch: { year: parsedYear },
  };

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
      years: {
        $filter: {
          input: "$years",
          as: "year",
          cond: { $eq: ["$$year.year", parsedYear] },
        },
      },
    },
  });

  const result = await Leave.aggregate(pipeline);

  // Transform the result to the desired format
  const transformedResult = result.flatMap((leave: any) =>
    leave.years.map((yearData: any) => ({
      employee_id: leave.employee_id,
      year: yearData.year,
      casual: yearData.casual,
      earned: yearData.earned,
      sick: yearData.sick,
      without_pay: yearData.without_pay,
    }))
  );

  const total = await Leave.countDocuments(matchStage.$match);
  return {
    result: transformedResult,
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
const updateLeaveService = async (
  id: string,
  year: number,
  updateData: LeaveYear
) => {
  const result = await Leave.findOneAndUpdate(
    { employee_id: id, "years.year": year },
    { $set: { "years.$": updateData } },
    {
      new: true,
    }
  );
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
