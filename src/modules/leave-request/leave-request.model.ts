import mongoose, { model } from "mongoose";
import {
  ELeaveRequestStatus,
  ELeaveRequestType,
  LeaveRequestType,
} from "./leave-request.type";

const leaveSchema = new mongoose.Schema<LeaveRequestType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    leave_type: {
      type: String,
      required: true,
      enum: Object.values(ELeaveRequestType),
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    day_count: {
      type: Number,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ELeaveRequestStatus),
      default: ELeaveRequestStatus.PENDING,
    },
    response_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// index for faster search
leaveSchema.index({ employee_id: 1 });
leaveSchema.index({ end_date: 1 });

export const LeaveRequest = model<LeaveRequestType>(
  "leave_request",
  leaveSchema
);
