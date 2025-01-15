import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeEducationService } from "./employee-education.service";

// get all data
const getAllEmployeeEducationController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const employeeEducation =
      await employeeEducationService.getAllEmployeeEducationService(
        paginationOptions,
        filterOption
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeEducation.result,
      meta: employeeEducation.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getEmployeeEducationController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeEducation =
      await employeeEducationService.getEmployeeEducationService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeEducation,
      message: "data get successfully",
    });
  }
);

// update data
const updateEmployeeEducationController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await employeeEducationService.updateEmployeeEducationService(
      id,
      updateData
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteEmployeeEducationController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await employeeEducationService.deleteEmployeeEducationService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const employeeEducationController = {
  getAllEmployeeEducationController,
  getEmployeeEducationController,
  deleteEmployeeEducationController,
  updateEmployeeEducationController,
};
