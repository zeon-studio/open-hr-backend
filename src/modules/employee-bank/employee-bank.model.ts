import mongoose, { model } from "mongoose";
import { EmployeeBankType } from "./employee-bank.type";

const employeeBankSchema = new mongoose.Schema<EmployeeBankType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    banks: [
      {
        bank_name: {
          type: String,
          required: true,
        },
        bank_ac_name: {
          type: String,
          required: true,
        },
        bank_ac_no: {
          type: String,
          required: true,
        },
        bank_district: {
          type: String,
          required: true,
        },
        bank_branch: {
          type: String,
          required: true,
        },
        bank_routing_no: {
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

export const EmployeeBank = model<EmployeeBankType>(
  "employee_bank",
  employeeBankSchema
);
