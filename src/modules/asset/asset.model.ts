import mongoose, { model } from "mongoose";
import { AssetType, EAssetStatus, ECurrency } from "./asset.type";

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
      enum: Object.values(ECurrency),
      required: true,
    },
    purchase_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(EAssetStatus),
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

// index for faster search
assetSchema.index({ asset_id: 1 });
assetSchema.index({ user: 1 });

export const Asset = model<AssetType>("asset", assetSchema);
