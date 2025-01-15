import mongoose, { model } from "mongoose";
import { EmployeeJobType } from "./employee-job.type";

const employeeJobSchema = new mongoose.Schema<EmployeeJobType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    job_type: {
      type: String,
      required: true,
    },
    joining_date: {
      type: Date,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    permanent_date: {
      type: Date,
    },
    company_name: {
      type: String,
      required: true,
      default: "themefisher",
    },
    company_website: {
      type: String,
      required: true,
      default: "https://themefisher.com",
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

export const EmployeeJob = model<EmployeeJobType>(
  "employee_job",
  employeeJobSchema
);
