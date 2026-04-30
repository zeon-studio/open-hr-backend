import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import requireSelfOrPrivileged from "@/middlewares/requireSelfOrPrivileged";
import express from "express";
import { leaveRequestController } from "./leave-request.controller";

const leaveRequestRouter = express.Router();

// get all data
leaveRequestRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  leaveRequestController.getAllLeaveRequestController
);

// get upcoming leave request
leaveRequestRouter.get(
  "/upcoming/:current_date",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  leaveRequestController.getUpcomingLeaveRequestController
);

// get upcoming leave request
leaveRequestRouter.get(
  "/upcoming-dates/:current_date",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  leaveRequestController.getUpcomingLeaveRequestDatesController
);

// get single data (param :id is the employee_id)
leaveRequestRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  requireSelfOrPrivileged("id"),
  leaveRequestController.getLeaveRequestController
);

// create data
leaveRequestRouter.post(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  leaveRequestController.createLeaveRequestController
);

// update data
leaveRequestRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  leaveRequestController.updateLeaveRequestController
);

// delete data — ownership enforced inside the service because :id is a
// Mongo _id, not employee_id (so the requireSelfOrPrivileged middleware
// cannot compare it directly).
leaveRequestRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  leaveRequestController.deleteLeaveRequestController
);

export default leaveRequestRouter;
