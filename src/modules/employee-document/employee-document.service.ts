import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { EmployeeDocument } from "./employee-document.model";
import {
  EmployeeDocumentFilterOptions,
  EmployeeDocumentType,
} from "./employee-document.type";

// get all data
const getAllEmployeeDocumentService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<EmployeeDocumentFilterOptions>
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
        banks: 1,
        "employee.name": 1,
        "employee.image": 1,
      },
    }
  );

  const result = await EmployeeDocument.aggregate(pipeline);
  const total = await EmployeeDocument.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getEmployeeDocumentService = async (id: string) => {
  const result = await EmployeeDocument.findOne({ employee_id: id });
  return result;
};

// add or update
const updateEmployeeDocumentService = async (
  id: string,
  updateData: EmployeeDocumentType
) => {
  const result = await EmployeeDocument.findOneAndUpdate(
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
const deleteEmployeeDocumentService = async (id: string) => {
  await EmployeeDocument.findOneAndDelete({ employee_id: id });
};

export const employeeDocumentService = {
  getAllEmployeeDocumentService,
  getEmployeeDocumentService,
  deleteEmployeeDocumentService,
  updateEmployeeDocumentService,
};
