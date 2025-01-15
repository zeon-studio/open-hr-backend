import mongoose, { model } from "mongoose";
import { ToolType } from "./tool.type";

const toolSchema = new mongoose.Schema<ToolType>(
  {
    platform: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    organizations: [
      {
        name: {
          type: String,
          required: true,
        },
        user_id: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
        },
        currency: {
          type: String,
        },
        users: [
          {
            type: String,
          },
        ],
        purchase_date: {
          type: Date,
          required: true,
        },
        expire_date: {
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

export const Tool = model<ToolType>("tool", toolSchema);
