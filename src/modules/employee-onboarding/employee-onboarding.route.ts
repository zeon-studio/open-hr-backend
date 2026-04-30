import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import requireSelfOrPrivileged from "@/middlewares/requireSelfOrPrivileged";
import express from "express";
import { employeeOnboardingController } from "./employee-onboarding.controller";

const employeeOnboardingRouter = express.Router();

// get all data
employeeOnboardingRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeOnboardingController.getAllEmployeeOnboardingController
);

// get pending onboarding task
employeeOnboardingRouter.get(
  "/pending-task",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOnboardingController.getPendingOnboardingTaskController
);

// update task status
employeeOnboardingRouter.patch(
  "/task/:id/:taskName",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOnboardingController.updateOnboardingTaskStatusController
);

// get single data
employeeOnboardingRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  requireSelfOrPrivileged("id"),
  employeeOnboardingController.getEmployeeOnboardingController
);

// update data
employeeOnboardingRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOnboardingController.updateEmployeeOnboardingController
);

// delete data
employeeOnboardingRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeOnboardingController.deleteEmployeeOnboardingController
);

export default employeeOnboardingRouter;
