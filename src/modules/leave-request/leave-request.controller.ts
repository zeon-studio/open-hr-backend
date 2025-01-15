import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { leaveRequestService } from "./leave-request.service";

// get all data
const getAllLeaveRequestController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const leave = await leaveRequestService.getAllLeaveRequestService(
      paginationOptions,
      filterOption
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: leave.result,
      meta: leave.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getLeaveRequestController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const leave = await leaveRequestService.getLeaveRequestService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: leave,
      message: "data get successfully",
    });
  }
);

// create data
const createLeaveRequestController = catchAsync(
  async (req: Request, res: Response) => {
    const leaveData = req.body;
    const leave =
      await leaveRequestService.createLeaveRequestService(leaveData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: leave,
      message: "data created successfully",
    });
  }
);

// update data
const updateLeaveRequestController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await leaveRequestService.updateLeaveRequestService(id, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteLeaveRequestController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await leaveRequestService.deleteLeaveRequestService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const leaveRequestController = {
  getAllLeaveRequestController,
  getLeaveRequestController,
  createLeaveRequestController,
  updateLeaveRequestController,
  deleteLeaveRequestController,
};
