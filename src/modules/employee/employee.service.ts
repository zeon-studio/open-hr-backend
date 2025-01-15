import ApiError from "@/errors/ApiError";
import { generateEmployeeId } from "@/lib/IdGenerator";
import { calculateRemainingLeave } from "@/lib/leaveCount";
import { mailSender } from "@/lib/mailSender";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import httpStatus from "http-status";
import { PipelineStage } from "mongoose";
import { EmployeeJob } from "../employee-job/employee-job.model";
import { EmployeeOnboarding } from "../employee-onboarding/employee-onboarding.model";
import { Leave } from "../leave/leave.model";
import { Employee } from "./employee.model";
import {
  EmployeeCreateType,
  EmployeeFilterOptions,
  EmployeeType,
} from "./employee.type";

// get all employees
const getAllEmployeeService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: EmployeeFilterOptions
) => {
  const { limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract search and filter options
  const { search } = filterOptions;

  // Create a text search stage for multiple fields
  let matchStage: any = {
    $match: {},
  };

  // Search condition
  if (search) {
    const searchKeyword = String(search).replace(/\+/g, " ");
    const keywords = searchKeyword.split("|");
    const searchConditions = keywords.map((keyword) => ({
      $or: [
        { work_email: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ],
    }));
    matchStage.$match.$or = searchConditions;
  }

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
      id: 1,
      name: 1,
      image: 1,
      work_email: 1,
      personal_email: 1,
      role: 1,
      dob: 1,
      nid: 1,
      tin: 1,
      phone: 1,
      gender: 1,
      blood_group: 1,
      marital_status: 1,
      present_address: 1,
      permanent_address: 1,
      facebook: 1,
      twitter: 1,
      linkedin: 1,
      status: 1,
      note: 1,
      createdAt: 1,
    },
  });

  // Reapply sorting after grouping
  pipeline.push({
    $sort: {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    },
  });

  // result
  const result = await Employee.aggregate(pipeline);
  const total = await Employee.countDocuments(matchStage.$match);

  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single employee
const getSingleEmployeeService = async (
  id: string
): Promise<EmployeeType | null> => {
  const employee = await Employee.aggregate([
    {
      $match: { id: id },
    },
    {
      $lookup: {
        from: "employee_personas",
        localField: "id",
        foreignField: "id",
        as: "persona",
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        image: 1,
        createdAt: 1,
        "persona.image": 1,
      },
    },
  ]);

  return employee[0];
};

// insert employee
const createEmployeeService = async (employeeData: EmployeeCreateType) => {
  const session = await Employee.startSession();
  session.startTransaction();
  try {
    // count data by department
    const departmentSerial =
      (await Employee.countDocuments({ department: employeeData.department })) +
      1;

    const joiningDate = new Date(employeeData.joining_date);

    const employeeId = generateEmployeeId(
      employeeData.department,
      joiningDate,
      departmentSerial
    );

    const createEmployeeData = {
      id: employeeId,
      personal_email: employeeData.personal_email,
    };

    const createEmployeeJobData = {
      employee_id: employeeId,
      department: employeeData.department,
      manager_id: employeeData.manager_id,
      job_type: employeeData.job_type,
      designation: employeeData.designation,
      joining_date: joiningDate,
    };

    const createEmployeeLeaveData = {
      employee_id: employeeId,
      years: [
        {
          year: joiningDate.getFullYear(),
          casual: {
            allotted: calculateRemainingLeave(joiningDate, 10),
            consumed: 0,
          },
          sick: {
            allotted: calculateRemainingLeave(joiningDate, 5),
            consumed: 0,
          },
          earned: {
            allotted: 0,
            consumed: 0,
          },
          without_pay: {
            allotted: calculateRemainingLeave(joiningDate, 30),
            consumed: 0,
          },
        },
      ],
    };

    const createEmployeeOnboardingData = {
      employee_id: employeeId,
      add_fingerprint: {
        task_name: "Add Fingerprint",
        assigned_to: "TFADM2022001",
        status: "pending",
      },
      provide_id_card: {
        task_name: "Provide ID Card",
        assigned_to: "TFADM2022001",
        status: "pending",
      },
      provide_appointment_letter: {
        task_name: "Provide Appointment Letter",
        assigned_to: "TFADM2022001",
        status: "pending",
      },
      provide_employment_contract: {
        task_name: "Provide Employment Contract",
        assigned_to: "TFADM2022001",
        status: "pending",
      },
      provide_welcome_kit: {
        task_name: "Provide Welcome Kit",
        assigned_to: "TFADM2022001",
        status: "pending",
      },
      provide_devices: {
        task_name: "Provide Devices",
        assigned_to: "TFADM2022001",
        status: "pending",
      },
      provide_office_intro: {
        task_name: "Provide Office Intro",
        assigned_to: "TFADM2022001",
        status: "pending",
      },
    };

    const newEmployeeData = new Employee(createEmployeeData);
    const insertedEmployee = await newEmployeeData.save({ session });

    const newEmployeeJobData = new EmployeeJob(createEmployeeJobData);
    await newEmployeeJobData.save({ session });

    const newEmployeeLeaveData = new Leave(createEmployeeLeaveData);
    await newEmployeeLeaveData.save({ session });

    const newEmployeeOnboardingData = new EmployeeOnboarding(
      createEmployeeOnboardingData
    );
    await newEmployeeOnboardingData.save({ session });

    await mailSender.invitationRequest(
      employeeData.personal_email,
      employeeData.designation,
      joiningDate
    );

    await session.commitTransaction();
    session.endSession();

    return insertedEmployee;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// update
const updateEmployeeService = async (updatedData: EmployeeType, id: string) => {
  // const employee = await Employee.findOne({ id });
  // if (
  //   employee?.image !== updatedData.image &&
  //   employee?.image &&
  //   !employee.image.startsWith("http")
  // ) {
  //   await deleteFile(employee?.image);
  // }
  const result = await Employee.findOneAndUpdate({ id: id }, updatedData, {
    new: true,
  });
  return result;
};

// update employee note
const updateEmployeeNoteService = async (note: string, id: string) => {
  const result = await Employee.findOneAndUpdate(
    { id: id },
    { note },
    {
      new: true,
    }
  );
  return result;
};

// delete employee
const deleteEmployeeService = async (id: string) => {
  try {
    const deleteEmployee = await Employee.findOneAndDelete(
      { id: id },
      { new: true }
    );

    if (!deleteEmployee) {
      throw new ApiError("employee is not delete", httpStatus.FORBIDDEN, "");
    }
  } catch (error) {
    throw new ApiError("employee is not delete", httpStatus.FORBIDDEN, "");
  }
};

export const employeeService = {
  getAllEmployeeService,
  createEmployeeService,
  getSingleEmployeeService,
  updateEmployeeService,
  updateEmployeeNoteService,
  deleteEmployeeService,
};
