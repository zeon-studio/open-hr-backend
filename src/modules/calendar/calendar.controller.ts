import catchAsync from "@/lib/catchAsync";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { calendarService } from "./calendar.service";

// get all data
const getAllCalendarController = catchAsync(
  async (req: Request, res: Response) => {
    const calendar = await calendarService.getAllCalendarService();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: calendar,
      meta: {
        total: calendar.length,
      },
      message: "data get successfully",
    });
  }
);

const getCalendarController = catchAsync(
  async (req: Request, res: Response) => {
    const year = Number(req.params.year);
    const calendar = await calendarService.getCalendarService(year);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: calendar,
      message: "data get successfully",
    });
  }
);

// create data
const createCalendarController = catchAsync(
  async (req: Request, res: Response) => {
    const calendarData = req.body;
    const calendar = await calendarService.createCalendarService(calendarData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: calendar,
      message: "data created successfully",
    });
  }
);

// update data
const updateCalendarController = catchAsync(
  async (req: Request, res: Response) => {
    const year = req.params.year;
    const updateData = req.body;

    await calendarService.updateCalendarService(year, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteCalendarController = catchAsync(
  async (req: Request, res: Response) => {
    const year = req.params.year;
    await calendarService.deleteCalendarService(year);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

// get upcoming events and holidays
const getUpcomingEventsAndHolidaysController = catchAsync(
  async (req: Request, res: Response) => {
    const current_date = req.params.current_date
      ? new Date(req.params.current_date as string)
      : new Date();
    const calendar =
      await calendarService.getUpcomingEventsAndHolidaysService(current_date);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: calendar,
      message: "data get successfully",
    });
  }
);

export const calendarController = {
  getAllCalendarController,
  getCalendarController,
  createCalendarController,
  updateCalendarController,
  deleteCalendarController,
  getUpcomingEventsAndHolidaysController,
};
