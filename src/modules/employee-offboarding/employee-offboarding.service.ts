import ApiError from "@/errors/ApiError";
import { mailSender } from "@/lib/mailSender";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import mongoose, { PipelineStage } from "mongoose";
import { EmployeeJob } from "../employee-job/employee-job.model";
import { Employee } from "../employee/employee.model";
import { Payroll } from "../payroll/payroll.model";
import { settingService } from "../setting/setting.service";
import { EmployeeOffboarding } from "./employee-offboarding.model";
import {
  EmployeeOffboardingCreate,
  EmployeeOffboardingFilterOptions,
  EmployeeOffboardingType,
} from "./employee-offboarding.type";

// get all data
const getAllEmployeeOffboardingService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<EmployeeOffboardingFilterOptions>
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
      tasks: 1,
    },
  });

  const result = await EmployeeOffboarding.aggregate(pipeline);
  const total = await EmployeeOffboarding.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getEmployeeOffboardingService = async (id: string) => {
  const result = await EmployeeOffboarding.findOne({ employee_id: id });
  return result;
};

// create
const createEmployeeOffboardingService = async (
  data: EmployeeOffboardingCreate
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const employeeData = await Employee.findOne(
      {
        id: data.employee_id,
      },
      null,
      { session }
    );

    // update employee status
    await Employee.findOneAndUpdate(
      { id: data.employee_id },
      { $set: { status: "archived" } },
      { session }
    );

    // update resignation date on employee job
    await EmployeeJob.findOneAndUpdate(
      { employee_id: data.employee_id },
      { $set: { resignation_date: data.resignation_date } },
      { session }
    );

    // update payroll status
    await Payroll.findOneAndUpdate(
      { employee_id: data.employee_id },
      { $set: { status: "archived" } },
      { session }
    );

    // update employee leave status
    await Employee.findOneAndUpdate(
      { employee_id: data.employee_id },
      { $set: { status: "archived" } },
      { session }
    );

    const offboardingTasks = await settingService.getOffboardingTasksService();
    const createEmployeeOffboardingData = {
      employee_id: data.employee_id,
      tasks: offboardingTasks.map((task) => ({
        task_name: task.name,
        assigned_to: task.assigned_to,
        status: "pending",
      })),
    };

    const result = await EmployeeOffboarding.create(
      [createEmployeeOffboardingData],
      { session }
    );

    await mailSender.offboardingInitiate(
      employeeData?.personal_email! || employeeData?.work_email!,
      employeeData?.name!,
      data.resignation_date
    );

    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new ApiError(error.message, 400);
  } finally {
    session.endSession();
  }
};

// update
const updateEmployeeOffboardingService = async (
  id: string,
  updateData: EmployeeOffboardingType
) => {
  const result = await EmployeeOffboarding.findOneAndUpdate(
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
const updateOffboardingTaskStatusService = async (
  id: string,
  taskName: string
) => {
  const result = await EmployeeOffboarding.findOneAndUpdate(
    { employee_id: id, "tasks.task_name": taskName },
    { $set: { "tasks.$.status": "completed" } },
    {
      new: true,
    }
  );
  return result;
};

// delete
const deleteEmployeeOffboardingService = async (id: string) => {
  await EmployeeOffboarding.findOneAndDelete({ employee_id: id });
};

// get all pending offboarding task
const getPendingOffboardingTaskService = async () => {
  const result = await EmployeeOffboarding.aggregate([
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

export const employeeOffboardingService = {
  getAllEmployeeOffboardingService,
  getEmployeeOffboardingService,
  createEmployeeOffboardingService,
  updateEmployeeOffboardingService,
  updateOffboardingTaskStatusService,
  deleteEmployeeOffboardingService,
  getPendingOffboardingTaskService,
};
