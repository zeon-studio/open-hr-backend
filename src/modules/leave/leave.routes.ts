import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import requireSelfOrPrivileged from "@/middlewares/requireSelfOrPrivileged";
import express from "express";
import { leaveController } from "./leave.controller";

const leaveRouter = express.Router();

// get all data
leaveRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  leaveController.getAllLeaveController
);

// add new year data — admin-only mass write across all employees
leaveRouter.patch(
  "/update-year/:year",
  auth(ENUM_ROLE.ADMIN),
  leaveController.addNewYearLeaveController
);

// get single data
leaveRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  requireSelfOrPrivileged("id"),
  leaveController.getLeaveController
);

// update data
leaveRouter.patch(
  "/:id/:year",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  leaveController.updateLeaveController
);

// delete data
leaveRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  leaveController.deleteLeaveController
);

export default leaveRouter;
