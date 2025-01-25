import mongoose, { model } from "mongoose";
import { AssetType } from "./asset.type";

const assetSchema = new mongoose.Schema<AssetType>(
  {
    asset_id: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    serial_number: {
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
    purchase_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
    note: {
      type: String,
    },
    logs: [
      {
        type: {
          type: String,
        },
        description: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Asset = model<AssetType>("asset", assetSchema);
