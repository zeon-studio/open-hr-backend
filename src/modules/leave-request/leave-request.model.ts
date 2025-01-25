import mongoose, { model } from "mongoose";
import { LeaveRequestType } from "./leave-request.type";

const leaveSchema = new mongoose.Schema<LeaveRequestType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    leave_type: {
      type: String,
      required: true,
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
      default: "pending",
    },
    response_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const LeaveRequest = model<LeaveRequestType>(
  "leave_request",
  leaveSchema
);
