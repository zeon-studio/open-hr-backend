import mongoose, { model } from "mongoose";
import { CourseType, ECurrency } from "./course.type";

const courseSchema = new mongoose.Schema<CourseType>(
  {
    platform: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          default: 0,
        },
        currency: {
          type: String,
          required: true,
          enum: ECurrency,
        },
        users: [
          {
            type: String,
          },
        ],
        purchase_date: {
          type: Date,
        },
        expire_date: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Course = model<CourseType>("course", courseSchema);
