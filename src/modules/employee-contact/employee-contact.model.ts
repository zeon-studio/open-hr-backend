import mongoose, { model } from "mongoose";
import { EmployeeContactType } from "./employee-contact.type";

const employeeContactSchema = new mongoose.Schema<EmployeeContactType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    contacts: [
      {
        name: {
          type: String,
          required: true,
        },
        relation: {
          type: String,
          required: true,
        },
        phone: {
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
employeeContactSchema.index({ employee_id: 1 });

export const EmployeeContact = model<EmployeeContactType>(
  "employee_contact",
  employeeContactSchema
);
