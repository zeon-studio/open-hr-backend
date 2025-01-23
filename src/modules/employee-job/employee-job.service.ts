import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
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
  const { search, designation } = filterOptions;

  // Search condition
  if (search) {
    const searchKeyword = String(search).replace(/\+/g, " ");
    const keywords = searchKeyword.split("|");
    const searchConditions = keywords.map((keyword) => ({
      $or: [{ employee_id: { $regex: keyword, $options: "i" } }],
    }));
    matchStage.$match.$or = searchConditions;
  }

  // designation condition
  if (designation) {
    matchStage.$match.designation = designation;
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
  const job = await EmployeeJob.findOne({ platform: id });

  if (job) {
    // Update existing jobs or add new ones
    updateData.prev_jobs.forEach((newJob) => {
      const existingJobIndex = job.prev_jobs.findIndex(
        (job) => job.company_name === newJob.company_name
      );
      if (existingJobIndex !== -1) {
        // Update existing job
        job.prev_jobs[existingJobIndex] = {
          ...job.prev_jobs[existingJobIndex],
          ...newJob,
        };
      } else {
        // Add new job
        job.prev_jobs.push(newJob);
      }
    });
    await job.save();
    return job;
  } else {
    // Create new job if it doesn't exist
    const newEmployeeJob = new EmployeeJob(updateData);
    await newEmployeeJob.save();
    return newEmployeeJob;
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
