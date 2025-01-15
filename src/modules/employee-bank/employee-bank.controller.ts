import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeBankService } from "./employee-bank.service";

// get all data
const getAllEmployeeBankController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const employeeBank = await employeeBankService.getAllEmployeeBankService(
      paginationOptions,
      filterOption
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeBank.result,
      meta: employeeBank.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getEmployeeBankController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeBank = await employeeBankService.getEmployeeBankService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employeeBank,
      message: "data get successfully",
    });
  }
);

// update data
const updateEmployeeBankController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await employeeBankService.updateEmployeeBankService(id, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteEmployeeBankController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await employeeBankService.deleteEmployeeBankService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const employeeBankController = {
  getAllEmployeeBankController,
  getEmployeeBankController,
  deleteEmployeeBankController,
  updateEmployeeBankController,
};
