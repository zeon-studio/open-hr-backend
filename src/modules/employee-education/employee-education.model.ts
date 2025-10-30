import mongoose, { model } from "mongoose";
import { EmployeeEducationType, EResultType } from "./employee-education.type";

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
          type: Number,
          required: true,
        },
        result_type: {
          type: String,
          required: true,
          enum: Object.values(EResultType),
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

// index for faster search
employeeEducationSchema.index({ employee_id: 1 });

export const EmployeeEducation = model<EmployeeEducationType>(
  "employee_education",
  employeeEducationSchema
);
