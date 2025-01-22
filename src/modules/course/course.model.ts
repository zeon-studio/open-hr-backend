import mongoose, { model } from "mongoose";
import { CourseType } from "./course.type";

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
          default: "bdt",
        },
        users: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Course = model<CourseType>("course", courseSchema);
