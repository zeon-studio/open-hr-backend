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
  const { limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract search and filter options
  const { search, platform } = filterOptions;

  // Search condition
  if (search) {
    const searchKeyword = String(search).replace(/\+/g, " ");
    const keywords = searchKeyword.split("|");
    const searchConditions = keywords.map((keyword) => ({
      $or: [{ name: { $regex: keyword, $options: "i" } }],
    }));
    matchStage.$match.$or = searchConditions;
  }

  // platform condition
  if (platform) {
    matchStage.$match.platform = platform;
  }

  let pipeline: PipelineStage[] = [matchStage];

  pipeline.push({ $sort: { updatedAt: -1 } });

  if (skip) {
    pipeline.push({ $skip: skip });
  }
  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push(
    {
      $lookup: {
        from: "employees",
        localField: "courses.user",
        foreignField: "id",
        as: "employee",
      },
    },
    {
      $project: {
        _id: 0,
        platform: 1,
        website: 1,
        email: 1,
        password: 1,
        courses: 1,
        "employee.name": 1,
        "employee.image": 1,
      },
    }
  );

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
  const course = await Course.findOne({ platform: id });

  if (course) {
    // Update existing courses or add new ones
    updateData.courses.forEach((newCourse) => {
      const existingCourseIndex = course.courses.findIndex(
        (course) => course.name === newCourse.name
      );
      if (existingCourseIndex !== -1) {
        // Update existing course
        course.courses[existingCourseIndex] = {
          ...course.courses[existingCourseIndex],
          ...newCourse,
        };
      } else {
        // Add new course
        course.courses.push(newCourse);
      }
    });
    await course.save();
    return course;
  } else {
    // Create new course if it doesn't exist
    const newCourse = new Course(updateData);
    await newCourse.save();
    return newCourse;
  }
};

// delete
const deleteCourseService = async (id: string) => {
  await Course.findOneAndDelete({ platform: id });
};

// get course by user
const getCoursesByUserService = async (id: string) => {
  const courses = await Course.find({ "courses.users": { $in: [id] } });

  const result = courses.flatMap((course) =>
    course.courses
      .filter((c) => c.users.includes(id))
      .map((c) => ({
        _id: c._id,
        name: c.name,
        platform: course.platform,
        website: course.website,
        email: course.email,
        password: course.password,
        purchase_date: c.purchase_date,
        price: c.price,
        expire_date: c.expire_date,
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
