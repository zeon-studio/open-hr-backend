import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { Payroll } from "./payroll.model";
import { PayrollFilterOptions, PayrollType } from "./payroll.type";

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
      job_type: 1,
      joining_date: 1,
      designation: 1,
      department: 1,
      manager_id: 1,
      permanent_date: 1,
      company_name: 1,
      company_website: 1,
      resignation_date: 1,
      prev_jobs: 1,
      promotions: 1,
      note: 1,
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

// get single data
const getPayrollService = async (id: string) => {
  const result = await Payroll.findOne({ employee_id: id });
  return result;
};

// update
const updatePayrollService = async (id: string, updateData: PayrollType) => {
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
  getPayrollService,
  deletePayrollService,
  updatePayrollService,
};
