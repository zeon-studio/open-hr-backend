import mongoose, { model } from "mongoose";
import { ELeaveRequestType } from "../leave-request/leave-request.type";
import { EModule, SettingType } from "./setting.type";

const settingSchema = new mongoose.Schema<SettingType>(
  {
    app_name: {
      type: String,
      required: true,
    },
    app_url: {
      type: String,
      required: true,
    },
    favicon_url: {
      type: String,
    },
    logo_url: {
      type: String,
    },
    logo_width: {
      type: Number,
    },
    logo_height: {
      type: Number,
    },
    company_name: {
      type: String,
      required: true,
    },
    company_website: {
      type: String,
      required: true,
    },
    modules: [
      {
        name: {
          type: String,
          required: true,
          enum: EModule,
        },
        description: {
          type: String,
        },
        enable: {
          type: Boolean,
          required: true,
        },
      },
    ],
    weekends: {
      type: [String],
      required: true,
    },
    conditional_weekends: [
      {
        name: {
          type: String,
        },
        pattern: {
          type: [Number],
        },
      },
    ],
    leaves: [
      {
        name: {
          type: String,
          required: true,
          enum: ELeaveRequestType,
        },
        days: {
          type: Number,
          required: true,
        },
      },
    ],
    onboarding_tasks: [
      {
        name: {
          type: String,
          required: true,
        },
        assigned_to: {
          type: String,
          required: true,
        },
      },
    ],
    offboarding_tasks: [
      {
        name: {
          type: String,
          required: true,
        },
        assigned_to: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Setting = model<SettingType>("setting", settingSchema);
