import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { EmployeeEducation } from "./employee-education.model";
import {
  EmployeeEducationFilterOptions,
  EmployeeEducationType,
} from "./employee-education.type";

// get all data
const getAllEmployeeEducationService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<EmployeeEducationFilterOptions>
) => {
  let matchStage: any = {
    $match: {},
  };
  const { limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

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

  let pipeline: PipelineStage[] = [matchStage];

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
      educations: 1,
    },
  });

  const result = await EmployeeEducation.aggregate(pipeline);
  const total = await EmployeeEducation.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getEmployeeEducationService = async (id: string) => {
  const result = await EmployeeEducation.findOne({ employee_id: id });
  return result;
};

// add or update
const updateEmployeeEducationService = async (
  id: string,
  updateData: EmployeeEducationType
) => {
  const result = await EmployeeEducation.findOneAndUpdate(
    { employee_id: id },
    updateData,
    {
      new: true,
      upsert: true,
    }
  );
  return result;
};

// delete
const deleteEmployeeEducationService = async (id: string) => {
  await EmployeeEducation.findOneAndDelete({ employee_id: id });
};

export const employeeEducationService = {
  getAllEmployeeEducationService,
  getEmployeeEducationService,
  deleteEmployeeEducationService,
  updateEmployeeEducationService,
};
