import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeDocumentService } from "./employee-document.service";

// get all data
const getAllEmployeeDocumentController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const employeeDocument =
      await employeeDocumentService.getAllEmployeeDocumentService(
        paginationOptions,
        filterOption
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeDocument.result,
      meta: employeeDocument.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getEmployeeDocumentController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeDocument =
      await employeeDocumentService.getEmployeeDocumentService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeDocument,
      message: "data get successfully",
    });
  }
);

// update data
const updateEmployeeDocumentController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await employeeDocumentService.updateEmployeeDocumentService(id, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteEmployeeDocumentController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await employeeDocumentService.deleteEmployeeDocumentService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const employeeDocumentController = {
  getAllEmployeeDocumentController,
  getEmployeeDocumentController,
  deleteEmployeeDocumentController,
  updateEmployeeDocumentController,
};
