import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeOffboardingService } from "./employee-offboarding.service";

// get all data
const getAllEmployeeOffboardingController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const employeeOffboarding =
      await employeeOffboardingService.getAllEmployeeOffboardingService(
        paginationOptions,
        filterOption
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeOffboarding.result,
      meta: employeeOffboarding.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getEmployeeOffboardingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeOffboarding =
      await employeeOffboardingService.getEmployeeOffboardingService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeOffboarding,
      message: "data get successfully",
    });
  }
);

// update data
const updateEmployeeOffboardingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await employeeOffboardingService.updateEmployeeOffboardingService(
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

// update offboarding task status
const updateOffboardingTaskStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = req.params.task;
    await employeeOffboardingService.updateOffboardingTaskStatusService(
      id,
      task
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "task status updated successfully",
    });
  }
);

// delete data
const deleteEmployeeOffboardingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await employeeOffboardingService.deleteEmployeeOffboardingService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const employeeOffboardingController = {
  getAllEmployeeOffboardingController,
  getEmployeeOffboardingController,
  updateEmployeeOffboardingController,
  updateOffboardingTaskStatusController,
  deleteEmployeeOffboardingController,
};
