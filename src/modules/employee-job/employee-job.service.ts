import { localDate } from "@/lib/dateConverter";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { Employee } from "../employee/employee.model";
import { EmployeeJob } from "./employee-job.model";
import { EmployeeJobFilterOptions, EmployeeJobType } from "./employee-job.type";

// get all data
const getAllEmployeeJobService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<EmployeeJobFilterOptions>
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

  const result = await EmployeeJob.aggregate(pipeline);
  const total = await EmployeeJob.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getEmployeeJobService = async (id: string) => {
  const result = await EmployeeJob.findOne({ employee_id: id });
  return result;
};

// update
const updateEmployeeJobService = async (
  id: string,
  updateData: EmployeeJobType
) => {
  try {
    // Convert dates to local dates
    if (updateData.joining_date) {
      updateData.joining_date = localDate(new Date(updateData.joining_date));
    }
    if (updateData.permanent_date) {
      updateData.permanent_date = localDate(
        new Date(updateData.permanent_date)
      );
    }
    if (updateData.resignation_date) {
      updateData.resignation_date = localDate(
        new Date(updateData.resignation_date)
      );
    }
    if (updateData.promotions) {
      updateData.promotions = updateData.promotions.map((promotion) => ({
        ...promotion,
        promotion_date: localDate(new Date(promotion.promotion_date)),
      }));
    }
    if (updateData.prev_jobs) {
      updateData.prev_jobs = updateData.prev_jobs.map((prevJob) => ({
        ...prevJob,
        start_date: localDate(new Date(prevJob.start_date)),
        end_date: localDate(new Date(prevJob.end_date)),
      }));
    }

    // update employee designation on employee data
    const employee = await Employee.findOne({ id });
    if (employee && updateData.promotions && updateData.promotions.length > 0) {
      // Find the latest promotion by date
      const latestPromotion = updateData.promotions.reduce(
        (latest, current) => {
          const latestDate = new Date(latest.promotion_date);
          const currentDate = new Date(current.promotion_date);
          return currentDate > latestDate ? current : latest;
        }
      );

      employee.designation = latestPromotion.designation;
      await employee.save();
    }

    // update employee job data
    const result = await EmployeeJob.findOneAndUpdate(
      { employee_id: id },
      { $set: updateData },
      {
        new: true,
        upsert: true,
      }
    );
    return result;
  } catch (error) {
    console.error("Error in updateEmployeeJobService:", error);
    throw error;
  }
};

// delete
const deleteEmployeeJobService = async (id: string) => {
  await EmployeeJob.findOneAndDelete({ employee_id: id });
};

export const employeeJobService = {
  getAllEmployeeJobService,
  getEmployeeJobService,
  deleteEmployeeJobService,
  updateEmployeeJobService,
};
