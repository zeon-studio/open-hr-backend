import { localDate } from "@/lib/dateConverter";
import { mailSender } from "@/lib/mailSender";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import mongoose, { PipelineStage } from "mongoose";
import { Employee } from "../employee/employee.model";
import { Payroll } from "./payroll.model";
import {
  CreateMonthlySalary,
  PayrollFilterOptions,
  PayrollType,
} from "./payroll.type";

// get all data
const getAllPayrollService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<PayrollFilterOptions>
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
      gross_salary: 1,
      salary: 1,
      bonus: 1,
      increments: 1,
      status: 1,
    },
  });

  const result = await Payroll.aggregate(pipeline);
  const total = await Payroll.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get payroll basic data
const getPayrollBasicsService = async () => {
  const result = await Payroll.find(
    { status: "active" },
    { _id: 0, employee_id: 1, gross_salary: 1 }
  );
  return result;
};

// get single data
const getPayrollService = async (id: string) => {
  const result = await Payroll.findOne({ employee_id: id });
  return result;
};

// create monthly data
const createMonthlyPayrollService = async (payData: CreateMonthlySalary) => {
  const salaryDate = localDate(new Date(payData.salary_date));
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if salaryDate already exists
    const existingPayroll = await Payroll.findOne({
      "salary.date": salaryDate,
    }).session(session);

    if (existingPayroll) {
      throw new Error("Payroll data for this salary date already exists.");
    }

    const bulkOperations = payData.employees.map((data) => {
      const update: any = {
        $push: {
          salary: {
            amount: data.gross_salary,
            date: salaryDate,
          },
        },
      };

      if (data.bonus_amount) {
        update.$push.bonus = {
          amount: data.bonus_amount,
          type: data.bonus_type,
          reason: data.bonus_reason,
          date: salaryDate,
        };
      }

      return {
        updateOne: {
          filter: { employee_id: data.employee_id },
          update,
          upsert: true,
          new: true,
        },
      };
    });

    const result = await Payroll.bulkWrite(bulkOperations, { session });

    // Send email to each employee
    for (const data of payData.employees) {
      const employee = await Employee.findOne({ id: data.employee_id }).session(
        session
      );
      if (employee) {
        await mailSender.salarySheet(
          employee.work_email,
          employee.name,
          payData.salary_date,
          data.gross_salary,
          data.bonus_type,
          data.bonus_amount
        );
      }
    }

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// update
const updatePayrollService = async (id: string, updateData: PayrollType) => {
  // Convert dates to local dates
  if (updateData.salary) {
    updateData.salary = updateData.salary.map((salary) => ({
      ...salary,
      date: localDate(new Date(salary.date)),
    }));
  }
  if (updateData.bonus) {
    updateData.bonus = updateData.bonus.map((bonus) => ({
      ...bonus,
      date: localDate(new Date(bonus.date)),
    }));
  }
  if (updateData.increments) {
    updateData.increments = updateData.increments.map((increment) => ({
      ...increment,
      date: localDate(new Date(increment.date)),
    }));
  }

  const result = await Payroll.findOneAndUpdate(
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
const deletePayrollService = async (id: string) => {
  await Payroll.findOneAndDelete({ employee_id: id });
};

export const payrollService = {
  getAllPayrollService,
  getPayrollBasicsService,
  getPayrollService,
  createMonthlyPayrollService,
  updatePayrollService,
  deletePayrollService,
};
