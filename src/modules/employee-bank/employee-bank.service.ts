import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { EmployeeBank } from "./employee-bank.model";
import {
  EmployeeBankFilterOptions,
  EmployeeBankType,
} from "./employee-bank.type";

// get all data
const getAllEmployeeBankService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<EmployeeBankFilterOptions>
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
      banks: 1,
    },
  });

  const result = await EmployeeBank.aggregate(pipeline);
  const total = await EmployeeBank.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getEmployeeBankService = async (id: string) => {
  const result = await EmployeeBank.findOne({ employee_id: id });
  return result;
};

// add or update
const updateEmployeeBankService = async (
  id: string,
  updateData: EmployeeBankType
) => {
  const bank = await EmployeeBank.findOne({ platform: id });

  if (bank) {
    // Update existing banks or add new ones
    updateData.banks.forEach((newBank) => {
      const existingBankIndex = bank.banks.findIndex(
        (bank) => bank.bank_name === newBank.bank_name
      );
      if (existingBankIndex !== -1) {
        // Update existing bank
        bank.banks[existingBankIndex] = {
          ...bank.banks[existingBankIndex],
          ...newBank,
        };
      } else {
        // Add new bank
        bank.banks.push(newBank);
      }
    });
    await bank.save();
    return bank;
  } else {
    // Create new bank if it doesn't exist
    const newEmployeeBank = new EmployeeBank(updateData);
    await newEmployeeBank.save();
    return newEmployeeBank;
  }
};

// delete
const deleteEmployeeBankService = async (id: string) => {
  await EmployeeBank.findOneAndDelete({ employee_id: id });
};

export const employeeBankService = {
  getAllEmployeeBankService,
  getEmployeeBankService,
  deleteEmployeeBankService,
  updateEmployeeBankService,
};
