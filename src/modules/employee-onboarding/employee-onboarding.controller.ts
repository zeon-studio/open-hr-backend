import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeOnboardingService } from "./employee-onboarding.service";

// get all data
const getAllEmployeeOnboardingController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const employeeOnboarding =
      await employeeOnboardingService.getAllEmployeeOnboardingService(
        paginationOptions,
        filterOption
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeOnboarding.result,
      meta: employeeOnboarding.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getEmployeeOnboardingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeOnboarding =
      await employeeOnboardingService.getEmployeeOnboardingService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeOnboarding,
      message: "data get successfully",
    });
  }
);

// update data
const updateEmployeeOnboardingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await employeeOnboardingService.updateEmployeeOnboardingService(
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

// update onboarding task status
const updateOnboardingTaskStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = req.params.task;
    await employeeOnboardingService.updateOnboardingTaskStatusService(id, task);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "task status updated successfully",
    });
  }
);

// delete data
const deleteEmployeeOnboardingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await employeeOnboardingService.deleteEmployeeOnboardingService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

// get all pending onboarding task
const getPendingOnboardingTaskController = catchAsync(
  async (req: Request, res: Response) => {
    const pendingTask =
      await employeeOnboardingService.getPendingOnboardingTaskService();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: pendingTask,
      message: "data get successfully",
    });
  }
);

export const employeeOnboardingController = {
  getAllEmployeeOnboardingController,
  getEmployeeOnboardingController,
  updateEmployeeOnboardingController,
  updateOnboardingTaskStatusController,
  deleteEmployeeOnboardingController,
  getPendingOnboardingTaskController,
};
