import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { Course } from "./course.model";
import { CourseFilterOptions, CourseType } from "./course.type";

// get all data
const getAllCourseService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<CourseFilterOptions>
) => {
  let matchStage: any = {
    $match: {},
  };
  const { limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract search and filter options
  const { search, platform } = filterOptions;

  // Search condition
  if (search) {
    const searchKeyword = String(search).replace(/\+/g, " ");
    const keywords = searchKeyword.split("|");
    const searchConditions = keywords.map((keyword) => ({
      $or: [
        { platform: { $regex: keyword, $options: "i" } },
        { website: { $regex: keyword, $options: "i" } },
      ],
    }));
    matchStage.$match.$or = searchConditions;
  }

  // platform condition
  if (platform) {
    matchStage.$match.platform = platform;
  }

  let pipeline: PipelineStage[] = [matchStage];

  // Sorting stage
  pipeline.push({
    $sort: {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
      _id: 1,
    },
  });

  if (skip) {
    pipeline.push({ $skip: skip });
  }
  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push({
    $project: {
      _id: 1,
      platform: 1,
      website: 1,
      email: 1,
      password: 1,
      courses: 1,
    },
  });

  const result = await Course.aggregate(pipeline);
  const total = await Course.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getCourseService = async (id: string) => {
  const result = await Course.findOne({ platform: id });
  return result;
};

// create
const createCourseService = async (data: CourseType) => {
  const result = await Course.create(data);
  return result;
};

// update
const updateCourseService = async (id: string, updateData: CourseType) => {
  const course = await Course.findOne({ _id: id });

  if (course) {
    // Update existing course
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );
    return updatedCourse;
  } else {
    // Create new course
    const newCourse = new Course(updateData);
    await newCourse.save();
    return newCourse;
  }
};

// delete
const deleteCourseService = async (id: string) => {
  await Course.findOneAndDelete({ _id: id });
};

// get course by user
const getCoursesByUserService = async (id: string) => {
  const courses = await Course.find({
    $or: [
      { "courses.users": { $in: [id] } },
      { "courses.users": { $in: ["everyone"] } },
    ],
  });

  const result = courses.flatMap((course) =>
    course.courses
      .filter((c) => c.users.includes(id))
      .map((c) => ({
        _id: c._id,
        name: c.name,
        price: c.price,
        purchase_date: c.purchase_date,
        expire_date: c.expire_date,
        platform: course.platform,
        website: course.website,
        email: course.email,
        password: course.password,
      }))
  );

  return result;
};

export const courseService = {
  getAllCourseService,
  getCourseService,
  createCourseService,
  updateCourseService,
  deleteCourseService,
  getCoursesByUserService,
};
