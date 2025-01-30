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
      required: true,
      default: "https://themefisher.com/images/brands/logo_mark_gradient.png",
    },
    logo_url: {
      type: String,
      required: true,
      default:
        "https://themefisher.com/images/brands/full_logo_gradient_dark.png",
    },
    logo_width: {
      type: Number,
      required: true,
      default: 166,
    },
    logo_height: {
      type: Number,
      required: true,
      default: 36,
    },
    company_name: {
      type: String,
      required: true,
      default: "Themefisher",
    },
    company_website: {
      type: String,
      required: true,
      default: "https://themefisher.com",
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
