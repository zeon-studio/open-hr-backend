import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { employeeService } from "./employee.service";

// get all employees
const getAllEmployeeController = catchAsync(
  async (req: Request, res: Response) => {
    // Extract pagination options
    const paginationOptions = pick(req.query, paginationField);

    // Extract filter options
    let filterOptions = pick(req.query, ["search", "country"]);

    // Convert 'country' to array if it exists
    if (filterOptions.country && typeof filterOptions.country === "string") {
      filterOptions.country = filterOptions.country.split(",");
    }

    const employee = await employeeService.getAllEmployeeService(
      paginationOptions,
      filterOptions
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employee.result,
      meta: employee.meta,
      message: "data get successfully",
    });
  }
);

// get all employees id
const getAllEmployeeBasicsController = catchAsync(
  async (req: Request, res: Response) => {
    const employee = await employeeService.getAllEmployeeBasicsService();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employee,
      message: "data get successfully",
    });
  }
);

// get single employee
const getSingleEmployeeController = catchAsync(
  async (req: Request, res: Response) => {
    const employee = await employeeService.getSingleEmployeeService(
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employee,
      message: "employee get successfully",
    });
  }
);

// get single employee by invite token
const getSingleEmployeeByInviteTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const employee =
      await employeeService.getSingleEmployeeByInviteTokenService(
        req.params.token
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: employee,
      message: "employee get successfully",
    });
  }
);

// insert employee
const createEmployeeController = catchAsync(
  async (req: Request, res: Response) => {
    const employee = req.body;
    const employeeData = await employeeService.createEmployeeService(employee);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "data inserted successfully",
      result: employeeData,
    });
  }
);

// update controller
const updateEmployeeController = catchAsync(
  async (req: Request, res: Response) => {
    const employeeData = req.body.employeeData;
    const updateData = await employeeService.updateEmployeeService(
      employeeData,
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
      result: updateData,
    });
  }
);

// update employee email
const updateEmployeeEmailController = catchAsync(
  async (req: Request, res: Response) => {
    const email = req.body.email;
    const updateEmail = await employeeService.updateEmployeeEmailService(
      email,
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
      result: updateEmail,
    });
  }
);

// update employee discord
const updateEmployeeDiscordController = catchAsync(
  async (req: Request, res: Response) => {
    const discord = req.body.discord;
    const updateDiscord = await employeeService.updateEmployeeDiscordService(
      discord,
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
      result: updateDiscord,
    });
  }
);

// update employee personality
const updateEmployeePersonalityController = catchAsync(
  async (req: Request, res: Response) => {
    const personality = req.body.personality;
    const updatePersonality =
      await employeeService.updateEmployeePersonalityService(
        personality,
        req.params.id
      );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
      result: updatePersonality,
    });
  }
);

// delete showcase
const deleteEmployeeController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const deleteEmployee = await employeeService.deleteEmployeeService(id);
    sendResponse(res, {
      success: true,
      message: "data deleted successfully",
      result: deleteEmployee,
    });
  }
);

export const employeeController = {
  getAllEmployeeController,
  getAllEmployeeBasicsController,
  getSingleEmployeeController,
  getSingleEmployeeByInviteTokenController,
  createEmployeeController,
  updateEmployeeController,
  updateEmployeeEmailController,
  updateEmployeeDiscordController,
  updateEmployeePersonalityController,
  deleteEmployeeController,
};
