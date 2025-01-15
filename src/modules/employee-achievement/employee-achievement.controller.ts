import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeAchievementService } from "./employee-achievement.service";

// get all data
const getAllEmployeeAchievementController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const employeeAchievement =
      await employeeAchievementService.getAllEmployeeAchievementService(
        paginationOptions,
        filterOption
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeAchievement.result,
      meta: employeeAchievement.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getEmployeeAchievementController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeAchievement =
      await employeeAchievementService.getEmployeeAchievementService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeAchievement,
      message: "data get successfully",
    });
  }
);

// update data
const updateEmployeeAchievementController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await employeeAchievementService.updateEmployeeAchievementService(
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
const deleteEmployeeAchievementController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await employeeAchievementService.deleteEmployeeAchievementService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const employeeAchievementController = {
  getAllEmployeeAchievementController,
  getEmployeeAchievementController,
  deleteEmployeeAchievementController,
  updateEmployeeAchievementController,
};
