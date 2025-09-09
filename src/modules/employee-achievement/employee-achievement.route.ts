import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { employeeAchievementController } from "./employee-achievement.controller";

const employeeAchievementRouter = express.Router();

// get all data
employeeAchievementRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeAchievementController.getAllEmployeeAchievementController
);

// get single data
employeeAchievementRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  employeeAchievementController.getEmployeeAchievementController
);

// update data
employeeAchievementRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeAchievementController.updateEmployeeAchievementController
);

// delete data
employeeAchievementRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeAchievementController.deleteEmployeeAchievementController
);

export default employeeAchievementRouter;
