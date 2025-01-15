import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { toolService } from "./tool.service";

// get all data
const getAllToolController = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationField);
  const filterOption = pick(req.query, ["search"]);

  const tool = await toolService.getAllToolService(
    paginationOptions,
    filterOption
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: tool.result,
    meta: tool.meta,
    message: "data get successfully",
  });
});

// get single data
const getToolController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const tool = await toolService.getToolService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: tool,
    message: "data get successfully",
  });
});

// update data
const updateToolController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateData = req.body;

  await toolService.updateToolService(id, updateData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "data updated successfully",
  });
});

// delete data
const deleteToolController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await toolService.deleteToolService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "data deleted successfully",
  });
});

export const toolController = {
  getAllToolController,
  getToolController,
  updateToolController,
  deleteToolController,
};
