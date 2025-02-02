import { isOneYearPassed } from "@/lib/dateConverter";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { EmployeeJob } from "../employee-job/employee-job.model";
import { settingService } from "../setting/setting.service";
import { Leave } from "./leave.model";
import { LeaveFilterOptions, LeaveYear } from "./leave.type";

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

// add new year data
const addNewYearLeaveService = async (year: number) => {
  // Check if the year data already exists
  const existingYearData = await Leave.findOne({ "years.year": year });
  if (existingYearData) {
    return { message: "Year data already exists" };
  }

  const leaveAllottedDays = await settingService.getLeaveAllottedDays();
  const employees = await EmployeeJob.find({});

  for (const employee of employees) {
    const createEmployeeLeaveData = {
      year: year,
      casual: {
        allotted: leaveAllottedDays.casual,
        consumed: 0,
      },
      sick: {
        allotted: leaveAllottedDays.sick,
        consumed: 0,
      },
      earned: {
        allotted: leaveAllottedDays.earned,
        consumed: 0,
      },
      without_pay: {
        allotted: leaveAllottedDays.without_pay,
        consumed: 0,
      },
    };
    const previousYearData = await Leave.findOne({
      employee_id: employee.employee_id,
      "years.year": year - 1,
    });

    const permanentDate = new Date(employee.permanent_date);
    const currentDate = new Date(`01-01-${year}`);

    if (!isOneYearPassed(permanentDate, currentDate)) {
      createEmployeeLeaveData.earned.allotted = 0;
    }

    if (previousYearData) {
      const previousYear = previousYearData.years.find(
        (y: any) => y.year === year - 1
      );
      if (previousYear) {
        createEmployeeLeaveData.earned.allotted +=
          previousYear.earned.allotted - previousYear.earned.consumed;
      }
    }

    await Leave.updateMany(
      { employee_id: employee.employee_id, "years.year": { $ne: year } },
      { $push: { years: createEmployeeLeaveData } }
    );
  }

  return { message: "Year data added successfully" };
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
  addNewYearLeaveService,
  updateLeaveService,
  deleteLeaveService,
};
