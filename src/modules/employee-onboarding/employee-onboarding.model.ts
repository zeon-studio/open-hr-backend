import mongoose, { model } from "mongoose";
import { EmployeeOnboardingType } from "./employee-onboarding.type";

const employeeOnboardingSchema = new mongoose.Schema<EmployeeOnboardingType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    add_fingerprint: {
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
    provide_id_card: {
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
    provide_appointment_letter: {
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
    provide_employment_contract: {
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
    provide_welcome_kit: {
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
    provide_office_intro: {
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
