import mongoose, { model } from "mongoose";
import { EmployeeOffboardingType } from "./employee-offboarding.type";

const employeeOffboardingSchema = new mongoose.Schema<EmployeeOffboardingType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    remove_fingerprint: {
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
    task_handover: {
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
    collect_id_card: {
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
    collect_email: {
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
    nda_agreement: {
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
    provide_certificate: {
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
    farewell: {
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

export const EmployeeOffboarding = model<EmployeeOffboardingType>(
  "employee_offboarding",
  employeeOffboardingSchema
);
