import mongoose, { model } from "mongoose";
import { AssetType } from "./asset.type";

const assetSchema = new mongoose.Schema<AssetType>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    asset_id: {
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
    },
    currency: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    purchase_date: {
      type: Date,
      required: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
    },
    logs: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Asset = model<AssetType>("asset", assetSchema);
