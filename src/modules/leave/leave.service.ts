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
  const { limit, skip, sortBy, sortOrder } =
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

  matchStage.$match.status = { $ne: "archived" };

  let pipeline: PipelineStage[] = [matchStage];

  // Sorting stage
  pipeline.push({
    $sort: {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
      _id: 1,
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
  if (!year || year < 1900 || year > 2100) {
    throw new Error("Valid year is required");
  }

  // Check if the year data already exists
  const existingYearData = await Leave.findOne({ "years.year": year });
  if (existingYearData) {
    return { message: "Year data already exists" };
  }

  const leaveAllottedDays = await settingService.getLeaveAllottedDays();
  const employees = await EmployeeJob.find({});

  if (employees.length === 0) {
    throw new Error("No employees found");
  }

  const bulkOperations: any[] = [];

  for (const employee of employees) {
    const createEmployeeLeaveData = {
      year: year,
      casual: {
        allotted: leaveAllottedDays.casual || 0,
        consumed: 0,
      },
      sick: {
        allotted: leaveAllottedDays.sick || 0,
        consumed: 0,
      },
      earned: {
        allotted: leaveAllottedDays.earned || 0,
        consumed: 0,
      },
      without_pay: {
        allotted: leaveAllottedDays.without_pay || 0,
        consumed: 0,
      },
    };

    const permanentDate = new Date(employee.permanent_date);
    const currentDate = new Date(`01-01-${year}`);

    if (!isOneYearPassed(permanentDate, currentDate)) {
      createEmployeeLeaveData.earned.allotted = 0;
    }

    const previousYearData = await Leave.findOne({
      employee_id: employee.employee_id,
      "years.year": year - 1,
    });

    if (previousYearData) {
      const previousYear = previousYearData.years.find(
        (y: any) => y.year === year - 1
      );
      if (previousYear) {
        const carryOverEarned =
          previousYear.earned.allotted - previousYear.earned.consumed;
        createEmployeeLeaveData.earned.allotted += Math.max(0, carryOverEarned);
      }
    }

    bulkOperations.push({
      updateOne: {
        filter: { employee_id: employee.employee_id },
        update: { $push: { years: createEmployeeLeaveData } },
        upsert: true,
      },
    });
  }

  await Leave.bulkWrite(bulkOperations);
  return { message: "Year data added successfully" };
};

// update
const updateLeaveService = async (
  id: string,
  year: number,
  updateData: LeaveYear
) => {
  if (!id || !year || !updateData) {
    throw new Error("Employee ID, year, and update data are required");
  }

  const result = await Leave.findOneAndUpdate(
    { employee_id: id, "years.year": year },
    { $set: { "years.$": updateData } },
    { new: true }
  );

  if (!result) {
    throw new Error("Leave record not found");
  }

  return result;
};

// delete
const deleteLeaveService = async (id: string) => {
  if (!id) {
    throw new Error("Employee ID is required");
  }

  const result = await Leave.findOneAndDelete({ employee_id: id });
  if (!result) {
    throw new Error("Leave record not found");
  }

  return result;
};

export const leaveService = {
  getAllLeaveService,
  getLeaveService,
  addNewYearLeaveService,
  updateLeaveService,
  deleteLeaveService,
};
