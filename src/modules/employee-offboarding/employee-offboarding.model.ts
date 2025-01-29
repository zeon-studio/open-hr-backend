import mongoose, { model } from "mongoose";
import { EmployeeOffboardingType } from "./employee-offboarding.type";

const offboardingTaskSchema = new mongoose.Schema({
  task_name: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const employeeOffboardingSchema = new mongoose.Schema<EmployeeOffboardingType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    tasks: [offboardingTaskSchema],
  },
  {
    timestamps: true,
  }
);

export const EmployeeOffboarding = model<EmployeeOffboardingType>(
  "employee_offboarding",
  employeeOffboardingSchema
);
