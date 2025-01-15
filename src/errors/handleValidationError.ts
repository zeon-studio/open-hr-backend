import type { ErrorMessageType, ErrorResponseType } from "@/types";
import mongoose from "mongoose";

export const handleValidationErrors = (
  error: mongoose.Error.ValidationError
): ErrorResponseType => {
  const errors: ErrorMessageType[] = Object.keys(error.errors).map(
    (el: string) => {
      return {
        path: error.errors[el].path,
        message: error.errors[el].message,
      };
    }
  );
  const statusCode = 500;
  return {
    message: "Validation Error",
    errorMessage: errors,
    statusCode: statusCode,
  };
};
