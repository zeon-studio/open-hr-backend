import mongoose, { model } from "mongoose";
import { EDepartment, EJobType, EmployeeJobType } from "./employee-job.type";

const employeeJobSchema = new mongoose.Schema<EmployeeJobType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    job_type: {
      type: String,
      required: true,
      enum: EJobType,
    },
    joining_date: {
      type: Date,
      required: true,
    },
    department: {
      type: String,
      enum: EDepartment,
    },
    manager_id: {
      type: String,
    },
    designation: {
      type: String,
      required: true,
    },
    permanent_date: {
      type: Date,
    },
    resignation_date: {
      type: Date,
    },
    note: {
      type: String,
    },
    prev_jobs: {
      type: [
        {
          company_name: {
            type: String,
            required: true,
          },
          company_website: {
            type: String,
            required: true,
          },
          designation: {
            type: String,
            required: true,
          },
          start_date: {
            type: Date,
            required: true,
          },
          end_date: {
            type: Date,
          },
          job_type: {
            type: String,
            required: true,
            enum: EJobType,
          },
        },
      ],
    },
    promotions: {
      type: [
        {
          designation: {
            type: String,
            required: true,
          },
          promotion_date: {
            type: Date,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Add index on employee_id field for optimization
employeeJobSchema.index({ employee_id: 1 });

export const EmployeeJob = model<EmployeeJobType>(
  "employee_job",
  employeeJobSchema
);
