import mongoose, { model } from "mongoose";
import { AuthenticationType } from "./authentication.type";

// password verification token model
export const authenticationSchema = new mongoose.Schema<AuthenticationType>(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    pass_reset_token: {
      token: {
        type: String,
      },
      expires: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Authentication = model<AuthenticationType>(
  "authentication",
  authenticationSchema
);
