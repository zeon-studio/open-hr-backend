import { offboardingTasks } from "@/config/constants";
import ApiError from "@/errors/ApiError";
import { mailSender } from "@/lib/mailSender";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import mongoose, { PipelineStage } from "mongoose";
import { EmployeeJob } from "../employee-job/employee-job.model";
import { Employee } from "../employee/employee.model";
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
      remove_fingerprint: 1,
      task_handover: 1,
      collect_id_card: 1,
      collect_email: 1,
      collect_devices: 1,
      nda_agreement: 1,
      provide_certificate: 1,
      farewell: 1,
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
      { employee_id: data.employee_id },
      { $set: { status: "archived" } },
      { session }
    );

    // update resignation date on employee job
    await EmployeeJob.findOneAndUpdate(
      { employee_id: data.employee_id },
      { $set: { resignation_date: data.resignation_date } },
      { session }
    );

    const createEmployeeOffboardingData = {
      employee_id: data.employee_id,
      remove_fingerprint: {
        task_name: "Remove Fingerprint",
        assigned_to: offboardingTasks.remove_fingerprint,
        status: "pending",
      },
      task_handover: {
        task_name: "Handover Tasks",
        assigned_to: offboardingTasks.task_handover,
        status: "pending",
      },
      collect_id_card: {
        task_name: "Collect ID Card",
        assigned_to: offboardingTasks.collect_id_card,
        status: "pending",
      },
      collect_email: {
        task_name: "Collect Email Credentials",
        assigned_to: offboardingTasks.collect_email,
        status: "pending",
      },
      collect_devices: {
        task_name: "Collect Devices",
        assigned_to: offboardingTasks.collect_devices,
        status: "pending",
      },
      nda_agreement: {
        task_name: "Provide NDA",
        assigned_to: offboardingTasks.nda_agreement,
        status: "pending",
      },
      provide_certificate: {
        task_name: "Provide Certificate",
        assigned_to: offboardingTasks.provide_certificate,
        status: "pending",
      },
      farewell: {
        task_name: "Farewell",
        assigned_to: offboardingTasks.farewell,
        status: "pending",
      },
    };

    const result = await EmployeeOffboarding.create(
      [createEmployeeOffboardingData],
      { session }
    );

    await mailSender.offboardingInitiate(
      employeeData?.personal_email! ?? employeeData?.work_email,
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
const updateOffboardingTaskStatusService = async (id: string, task: string) => {
  const result = await EmployeeOffboarding.findOneAndUpdate(
    { employee_id: id },
    { $set: { [`${task}.status`]: "completed" } },
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
  const pendingTasks = [
    "remove_fingerprint",
    "task_handover",
    "collect_id_card",
    "collect_email",
    "collect_devices",
    "nda_agreement",
    "provide_certificate",
    "farewell",
  ];

  const matchConditions = pendingTasks.map((task) => ({
    [`${task}.status`]: "pending",
  }));

  const projectFields = pendingTasks.reduce((acc, task) => {
    acc[task] = {
      $cond: {
        if: { $eq: [`$${task}.status`, "pending"] },
        then: {
          $mergeObjects: [
            `$${task}`,
            {
              employee_id: "$employee_id",
              createdAt: "$createdAt",
              task_id: task,
            },
          ],
        },
        else: "$$REMOVE",
      },
    };
    return acc;
  }, {});

  const result = await EmployeeOffboarding.aggregate([
    {
      $match: {
        $or: matchConditions,
      },
    },
    {
      $project: {
        _id: 0,
        ...projectFields,
      },
    },
  ]);

  // Flatten the result array
  const flattenedResult = result.reduce((acc, item) => {
    pendingTasks.forEach((task) => {
      if (item[task]) {
        acc.push(item[task]);
      }
    });
    return acc;
  }, []);

  return flattenedResult;
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
