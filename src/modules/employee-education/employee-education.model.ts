import mongoose, { model } from "mongoose";
import { EmployeeEducationType } from "./employee-education.type";

const employeeEducationSchema = new mongoose.Schema<EmployeeEducationType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    educations: [
      {
        degree: {
          type: String,
          required: true,
        },
        institute: {
          type: String,
          required: true,
        },
        passing_year: {
          type: Number,
          required: true,
        },
        result: {
          type: String,
          required: true,
        },
        major: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const EmployeeEducation = model<EmployeeEducationType>(
  "employee_education",
  employeeEducationSchema
);
