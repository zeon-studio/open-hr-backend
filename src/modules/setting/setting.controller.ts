import catchAsync from "@/lib/catchAsync";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { settingService } from "./setting.service";

// get single data
const getSettingController = catchAsync(async (req: Request, res: Response) => {
  const setting = await settingService.getSettingService();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: setting,
    message: "data get successfully",
  });
});

// update data
const updateSettingController = catchAsync(
  async (req: Request, res: Response) => {
    const updateData = req.body;

    await settingService.updateSettingService(updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// update module status
const updateModuleStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const { name, enable } = req.body;
    const updatedModule = await settingService.updateModuleStatusService(
      name,
      enable
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: updatedModule,
      message: "Module status updated successfully",
    });
  }
);

export const settingController = {
  getSettingController,
  updateSettingController,
  updateModuleStatusController,
};
