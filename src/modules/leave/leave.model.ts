import mongoose, { model } from "mongoose";
import { ELeaveStatus, LeaveType } from "./leave.type";

const leaveSchema = new mongoose.Schema<LeaveType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: ELeaveStatus.ACTIVE,
      enum: Object.values(ELeaveStatus),
    },
    years: [
      {
        year: {
          type: Number,
          required: true,
        },
        casual: {
          allotted: {
            type: Number,
            required: true,
          },
          consumed: {
            type: Number,
            required: true,
            default: 0,
          },
        },
        earned: {
          allotted: {
            type: Number,
            required: true,
          },
          consumed: {
            type: Number,
            required: true,
            default: 0,
          },
        },
        sick: {
          allotted: {
            type: Number,
            required: true,
          },
          consumed: {
            type: Number,
            required: true,
            default: 0,
          },
        },
        without_pay: {
          allotted: {
            type: Number,
            required: true,
          },
          consumed: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// index for faster search
leaveSchema.index({ employee_id: 1 });
leaveSchema.index({ years: 1 });

export const Leave = model<LeaveType>("leave", leaveSchema);
