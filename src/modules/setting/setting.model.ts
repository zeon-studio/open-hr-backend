import mongoose, { model } from "mongoose";
import { SettingType } from "./setting.type";

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
