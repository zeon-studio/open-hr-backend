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

export const EmployeeContact = model<EmployeeContactType>(
  "employee_contact",
  employeeContactSchema
);
