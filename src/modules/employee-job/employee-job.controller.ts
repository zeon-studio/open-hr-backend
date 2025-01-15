import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeJobService } from "./employee-job.service";

// get all data
const getAllEmployeeJobController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const employeeJob = await employeeJobService.getAllEmployeeJobService(
      paginationOptions,
      filterOption
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeJob.result,
      meta: employeeJob.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getEmployeeJobController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeJob = await employeeJobService.getEmployeeJobService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeJob,
      message: "data get successfully",
    });
  }
);

// update data
const updateEmployeeJobController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await employeeJobService.updateEmployeeJobService(id, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteEmployeeJobController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await employeeJobService.deleteEmployeeJobService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const employeeJobController = {
  getAllEmployeeJobController,
  getEmployeeJobController,
  deleteEmployeeJobController,
  updateEmployeeJobController,
};
