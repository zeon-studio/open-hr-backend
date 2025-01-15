import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { assetService } from "./asset.service";

// get all data
const getAllAssetController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const asset = await assetService.getAllAssetService(
      paginationOptions,
      filterOption
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: asset.result,
      meta: asset.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getAssetController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const asset = await assetService.getAssetService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: asset,
    message: "data get successfully",
  });
});

// create data
const createAssetController = catchAsync(
  async (req: Request, res: Response) => {
    const assetData = req.body;
    const asset = await assetService.createAssetService(assetData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: asset,
      message: "data created successfully",
    });
  }
);

// update data
const updateAssetController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await assetService.updateAssetService(id, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteAssetController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await assetService.deleteAssetService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const assetController = {
  getAllAssetController,
  getAssetController,
  createAssetController,
  updateAssetController,
  deleteAssetController,
};
