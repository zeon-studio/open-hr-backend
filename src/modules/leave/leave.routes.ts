import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { leaveController } from "./leave.controller";

const leaveRouter = express.Router();

// get all data
leaveRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  leaveController.getAllLeaveController
);

// get single data
leaveRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  leaveController.getLeaveController
);

// add new year data
leaveRouter.patch(
  "/update-year",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  leaveController.addNewYearLeaveController
);

// update data
leaveRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  leaveController.updateLeaveController
);

// delete data
leaveRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  leaveController.deleteLeaveController
);

export default leaveRouter;
