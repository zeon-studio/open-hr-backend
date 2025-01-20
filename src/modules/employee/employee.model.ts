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
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    discord: {
      type: String,
    },
    personality: {
      type: String,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = model<EmployeeType>("employee", employeeSchema);
