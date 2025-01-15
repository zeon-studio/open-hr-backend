import mongoose, { model } from "mongoose";
import { EmployeeOnboardingType } from "./employee-onboarding.type";

const employeeOnboardingSchema = new mongoose.Schema<EmployeeOnboardingType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    fingerprint: {
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
    },
    id_card: {
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
    },
    appointment_letter: {
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
    },
    employment_contract: {
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
    },
    welcome_kit: {
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
    },
    office_intro: {
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
    },
  },
  {
    timestamps: true,
  }
);

export const EmployeeOnboarding = model<EmployeeOnboardingType>(
  "employee_onboarding",
  employeeOnboardingSchema
);
