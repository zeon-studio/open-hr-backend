import mongoose, { model } from "mongoose";
import {
  EAchievementType,
  EmployeeAchievementType,
} from "./employee-achievement.type";

const employeeAchievementSchema = new mongoose.Schema<EmployeeAchievementType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    achievements: [
      {
        type: {
          type: String,
          required: true,
          enum: EAchievementType,
        },
        description: {
          type: String,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const EmployeeAchievement = model<EmployeeAchievementType>(
  "employee_achievement",
  employeeAchievementSchema
);
