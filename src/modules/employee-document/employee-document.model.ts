import mongoose, { model } from "mongoose";
import { EmployeeDocumentType } from "./employee-document.type";

const employeeDocumentSchema = new mongoose.Schema<EmployeeDocumentType>(
  {
    employee_id: {
      type: String,
      required: true,
    },
    documents: [
      {
        name: {
          type: String,
          required: true,
        },
        file: {
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

// index for faster search
employeeDocumentSchema.index({ employee_id: 1 });

export const EmployeeDocument = model<EmployeeDocumentType>(
  "employee_document",
  employeeDocumentSchema
);
