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
      enum: Object.values(EDepartment),
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
      enum: Object.values(EGender),
    },
    blood_group: {
      type: String,
      enum: Object.values(EBloodGroup),
    },
    blood_donor: {
      type: Boolean,
      default: false,
    },
    marital_status: {
      type: String,
      enum: Object.values(EMaritalStatus),
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
      enum: Object.values(EEmployeeStatus),
      default: EEmployeeStatus.ACTIVE,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(ERole),
      default: ERole.USER,
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.index({ role: 1 });
employeeSchema.index({ work_email: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });

export const Employee = model<EmployeeType>("employee", employeeSchema);
