import { paginationField } from "@/config/constants";
import catchAsync from "@/lib/catchAsync";
import pick from "@/lib/filterPicker";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import { courseService } from "./course.service";

// get all data
const getAllCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationField);
    const filterOption = pick(req.query, ["search"]);

    const course = await courseService.getAllCourseService(
      paginationOptions,
      filterOption
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: course.result,
      meta: course.meta,
      message: "data get successfully",
    });
  }
);

// get single data
const getCourseController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const course = await courseService.getCourseService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: course,
    message: "data get successfully",
  });
});

// create data
const createCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const courseData = req.body;
    const course = await courseService.createCourseService(courseData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: course,
      message: "data created successfully",
    });
  }
);

// update data
const updateCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    await courseService.updateCourseService(id, updateData);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data updated successfully",
    });
  }
);

// delete data
const deleteCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await courseService.deleteCourseService(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "data deleted successfully",
    });
  }
);

export const courseController = {
  getAllCourseController,
  getCourseController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
};
