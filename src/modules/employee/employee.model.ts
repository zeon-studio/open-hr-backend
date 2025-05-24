import mongoose, { model } from "mongoose";
import {
  EBloodGroup,
  EDepartment,
  EEmployeeStatus,
  EGender,
  EMaritalStatus,
  EmployeeType,
  ERole,
} from "./employee.type";

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
      enum: EDepartment,
    },
    designation: {
      type: String,
      required: true,
    },
    communication_id: {
      type: String,
    },
    password: {
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
      enum: EGender,
    },
    blood_group: {
      type: String,
      enum: EBloodGroup,
    },
    marital_status: {
      type: String,
      enum: EMaritalStatus,
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
    personality: {
      type: String,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: EEmployeeStatus,
      default: EEmployeeStatus.ACTIVE,
    },
    role: {
      type: String,
      required: true,
      enum: ERole,
      default: ERole.USER,
    },
  },
  {
    timestamps: true,
  }
);

// index id for faster search
employeeSchema.index({ id: 1 });
employeeSchema.index({ role: 1 });

export const Employee = model<EmployeeType>("employee", employeeSchema);
