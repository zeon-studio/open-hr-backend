import mongoose, { model } from "mongoose";
import { EBonusType, EPayrollStatus, PayrollType } from "./payroll.type";

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
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
    bonus: [
      {
        type: {
          type: String,
          required: true,
          enum: EBonusType,
        },
        reason: {
          type: String,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
    increments: [
      {
        reason: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
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

// index for faster search
payrollSchema.index({ employee_id: 1 });

export const Payroll = model<PayrollType>("payroll", payrollSchema);
