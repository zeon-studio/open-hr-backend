import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { courseController } from "./course.controller";

const courseRouter = express.Router();

// get all data
courseRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  courseController.getAllCourseController
);

// get course by user
courseRouter.get(
  "/user/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  courseController.getCoursesByUserController
);

// get single data
courseRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  courseController.getCourseController
);

// create data
courseRouter.post(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  courseController.createCourseController
);

// update data
courseRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  courseController.updateCourseController
);

// delete data
courseRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  courseController.deleteCourseController
);

export default courseRouter;
