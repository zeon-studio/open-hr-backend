import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeContactService } from "./employee-contact.service";

// get all data
const getAllEmployeeContactController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const employeeContact =
      await employeeContactService.getAllEmployeeContactService(
        paginationOptions,
        filterOption
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeContact.result,
      meta: employeeContact.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getEmployeeContactController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeContact =
      await employeeContactService.getEmployeeContactService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeContact,
      message: "data get successfully",
    });
  }
);

// update data
const updateEmployeeContactController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await employeeContactService.updateEmployeeContactService(id, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteEmployeeContactController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await employeeContactService.deleteEmployeeContactService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const employeeContactController = {
  getAllEmployeeContactController,
  getEmployeeContactController,
  deleteEmployeeContactController,
  updateEmployeeContactController,
};
