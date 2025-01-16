import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { employeeAchievementController } from "./employee-achievement.controller";

const employeeAchievementRouter = express.Router();

// get all data
employeeAchievementRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeAchievementController.getAllEmployeeAchievementController
);

// get single data
employeeAchievementRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeAchievementController.getEmployeeAchievementController
);

// update data
employeeAchievementRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeAchievementController.updateEmployeeAchievementController
);

// delete data
employeeAchievementRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeAchievementController.deleteEmployeeAchievementController
);

export default employeeAchievementRouter;
