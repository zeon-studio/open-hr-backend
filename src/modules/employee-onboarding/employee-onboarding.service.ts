import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { EmployeeOnboarding } from "./employee-onboarding.model";
import {
  EmployeeOnboardingFilterOptions,
  EmployeeOnboardingType,
} from "./employee-onboarding.type";

// get all data
const getAllEmployeeOnboardingService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<EmployeeOnboardingFilterOptions>
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
      tasks: 1,
    },
  });

  const result = await EmployeeOnboarding.aggregate(pipeline);
  const total = await EmployeeOnboarding.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getEmployeeOnboardingService = async (id: string) => {
  const result = await EmployeeOnboarding.findOne({ employee_id: id });
  return result;
};

// update
const updateEmployeeOnboardingService = async (
  id: string,
  updateData: EmployeeOnboardingType
) => {
  const result = await EmployeeOnboarding.findOneAndUpdate(
    { employee_id: id },
    updateData,
    {
      new: true,
      upsert: true,
    }
  );
  return result;
};

// update onboarding task status
const updateOnboardingTaskStatusService = async (
  id: string,
  taskName: string
) => {
  const result = await EmployeeOnboarding.findOneAndUpdate(
    { employee_id: id, "tasks.task_name": taskName },
    { $set: { "tasks.$.status": "completed" } },
    {
      new: true,
    }
  );
  return result;
};

// delete
const deleteEmployeeOnboardingService = async (id: string) => {
  await EmployeeOnboarding.findOneAndDelete({ employee_id: id });
};

// get all pending onboarding task
const getPendingOnboardingTaskService = async () => {
  const result = await EmployeeOnboarding.aggregate([
    {
      $unwind: "$tasks",
    },
    {
      $match: {
        "tasks.status": "pending",
      },
    },
    {
      $project: {
        _id: 0,
        employee_id: 1,
        createdAt: 1,
        task_name: "$tasks.task_name",
        assigned_to: "$tasks.assigned_to",
        status: "$tasks.status",
      },
    },
  ]);

  return result;
};

export const employeeOnboardingService = {
  getAllEmployeeOnboardingService,
  getEmployeeOnboardingService,
  updateEmployeeOnboardingService,
  updateOnboardingTaskStatusService,
  deleteEmployeeOnboardingService,
  getPendingOnboardingTaskService,
};
