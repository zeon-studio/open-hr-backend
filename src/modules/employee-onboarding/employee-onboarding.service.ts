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

  pipeline.push(
    {
      $lookup: {
        from: "employees",
        localField: "employee_id",
        foreignField: "id",
        as: "employee",
      },
    },
    {
      $project: {
        _id: 0,
        employee_id: 1,
        add_fingerprint: 1,
        provide_id_card: 1,
        provide_appointment_letter: 1,
        provide_employment_contract: 1,
        provide_welcome_kit: 1,
        provide_devices: 1,
        provide_office_intro: 1,
        "employee.name": 1,
        "employee.image": 1,
      },
    }
  );

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
const updateOnboardingTaskStatusService = async (id: string, task: string) => {
  const result = await EmployeeOnboarding.findOneAndUpdate(
    { employee_id: id },
    { $set: { [`${task}.status`]: "completed" } },
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
  const pendingTasks = [
    "add_fingerprint",
    "provide_id_card",
    "provide_appointment_letter",
    "provide_employment_contract",
    "provide_welcome_kit",
    "provide_devices",
    "provide_office_intro",
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
            { employee_id: "$employee_id", createdAt: "$createdAt" },
          ],
        },
        else: "$$REMOVE",
      },
    };
    return acc;
  }, {});

  const result = await EmployeeOnboarding.aggregate([
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

export const employeeOnboardingService = {
  getAllEmployeeOnboardingService,
  getEmployeeOnboardingService,
  updateEmployeeOnboardingService,
  updateOnboardingTaskStatusService,
  deleteEmployeeOnboardingService,
  getPendingOnboardingTaskService,
};
