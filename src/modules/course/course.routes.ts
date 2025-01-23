import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { courseController } from "./course.controller";

const courseRouter = express.Router();

// get all data
courseRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  courseController.getAllCourseController
);

// get course by user
courseRouter.get(
  "/user/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  courseController.getCoursesByUserController
);

// get single data
courseRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  courseController.getCourseController
);

// create data
courseRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  courseController.createCourseController
);

// update data
courseRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  courseController.updateCourseController
);

// delete data
courseRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  courseController.deleteCourseController
);

export default courseRouter;
