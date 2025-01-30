import mongoose, { model } from "mongoose";
import { SettingType } from "./setting.type";

const settingSchema = new mongoose.Schema<SettingType>(
  {
    app_name: {
      type: String,
      required: true,
      default: "ERP Solution",
    },
    app_url: {
      type: String,
      required: true,
      default: "https://erp.teamosis.com",
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
    menus: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        access: {
          type: [String],
          required: true,
        },
      },
    ],
    weekends: {
      type: [String],
      required: true,
      default: ["Friday"],
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
        },
        type: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
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
        type: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
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
        type: {
          type: String,
          required: true,
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

export const Setting = model<SettingType>("setting", settingSchema);
