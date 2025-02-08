import mongoose, { model } from "mongoose";
import { EPayrollStatus, PayrollType } from "./payroll.type";

const payrollSchema = new mongoose.Schema<PayrollType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    gross_salary: {
      type: Number,
      required: true,
    },
    salary: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    bonus: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    increments: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: EPayrollStatus,
      default: EPayrollStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

export const Payroll = model<PayrollType>("payroll", payrollSchema);
