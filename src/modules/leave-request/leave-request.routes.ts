import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { leaveRequestController } from "./leave-request.controller";

const leaveRequestRouter = express.Router();

// get all data
leaveRequestRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  leaveRequestController.getAllLeaveRequestController
);

// get single data
leaveRequestRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.USER),
  leaveRequestController.getLeaveRequestController
);

// create data
leaveRequestRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  leaveRequestController.createLeaveRequestController
);

// update data
leaveRequestRouter.patch(
  "/:id",
  checkToken,
  // auth(ENUM_ROLE.ADMIN),
  leaveRequestController.updateLeaveRequestController
);

// delete data
leaveRequestRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  leaveRequestController.deleteLeaveRequestController
);

export default leaveRequestRouter;
