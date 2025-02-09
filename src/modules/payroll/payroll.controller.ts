import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { payrollService } from "./payroll.service";

// get all data
const getAllPayrollController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const payroll = await payrollService.getAllPayrollService(
      paginationOptions,
      filterOption
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: payroll.result,
      meta: payroll.meta,
      message: "data get successfully",
    });
  }
);

// get payroll basic data
const getPayrollBasicsController = catchAsync(
  async (req: Request, res: Response) => {
    const payroll = await payrollService.getPayrollBasicsService();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: payroll,
      message: "data get successfully",
    });
  }
);

// get single data
const getPayrollController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payroll = await payrollService.getPayrollService(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: payroll,
    message: "data get successfully",
  });
});

// create data
const createMonthlyPayrollController = catchAsync(
  async (req: Request, res: Response) => {
    const payData = req.body;
    await payrollService.createMonthlyPayrollService(payData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data created successfully",
    });
  }
);

// update data
const updatePayrollController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await payrollService.updatePayrollService(id, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deletePayrollController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await payrollService.deletePayrollService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const payrollController = {
  getAllPayrollController,
  getPayrollController,
  getPayrollBasicsController,
  createMonthlyPayrollController,
  updatePayrollController,
  deletePayrollController,
};
