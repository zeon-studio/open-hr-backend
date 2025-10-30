import mongoose, { model } from "mongoose";
import {
  EBilling,
  ECurrency,
  EOrganizationLogType,
  EOrganizationStatus,
  ToolType,
} from "./tool.type";

const toolSchema = new mongoose.Schema<ToolType>(
  {
    platform: {
      type: String,
      required: true,
      unique: true,
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
        login_id: {
          type: String,
          required: true,
        },
        password: {
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
          enum: Object.values(ECurrency),
        },
        billing: {
          type: String,
          required: true,
          enum: Object.values(EBilling),
        },
        users: [
          {
            type: String,
          },
        ],
        status: {
          type: String,
          required: true,
          enum: Object.values(EOrganizationStatus),
          default: EOrganizationStatus.ACTIVE,
        },
        logs: [
          {
            type: {
              type: String,
              enum: Object.values(EOrganizationLogType),
            },
            description: {
              type: String,
            },
            date: {
              type: Date,
              default: Date.now,
            },
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

// Indexes to speed up queries by organization status and expire date
toolSchema.index({ "organizations.status": 1 });
toolSchema.index({ "organizations.expire_date": 1 });

export const Tool = model<ToolType>("tool", toolSchema);
