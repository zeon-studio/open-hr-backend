import mongoose, { model } from "mongoose";
import { EmployeeOnboardingType } from "./employee-onboarding.type";

const onboardingTaskSchema = new mongoose.Schema({
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

const employeeOnboardingSchema = new mongoose.Schema<EmployeeOnboardingType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    tasks: [onboardingTaskSchema],
  },
  {
    timestamps: true,
  }
);

export const EmployeeOnboarding = model<EmployeeOnboardingType>(
  "employee_onboarding",
  employeeOnboardingSchema
);
