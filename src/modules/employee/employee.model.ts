import mongoose, { model } from "mongoose";
import { EmployeeType } from "./employee.type";

const employeeSchema = new mongoose.Schema<EmployeeType>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
    },
    work_email: {
      type: String,
    },
    personal_email: {
      type: String,
    },
    department: {
      type: String,
    },
    manager: {
      type: String,
    },
    role: {
      type: String,
    },
    nid: {
      type: String,
    },
    tin: {
      type: String,
    },
    gender: {
      type: String,
    },
    blood_group: {
      type: String,
    },
    marital_status: {
      type: String,
    },
    present_address: {
      type: String,
    },
    permanent_address: {
      type: String,
    },
    status: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = model<EmployeeType>("employee", employeeSchema);
