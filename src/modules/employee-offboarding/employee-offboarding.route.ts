import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { employeeOffboardingController } from "./employee-offboarding.controller";

const employeeOffboardingRouter = express.Router();

// get all data
employeeOffboardingRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  employeeOffboardingController.getAllEmployeeOffboardingController
);

// get pending onboarding task
employeeOffboardingRouter.get(
  "/pending-task",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOffboardingController.getPendingOffboardingTaskController
);

// create data
employeeOffboardingRouter.post(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOffboardingController.createEmployeeOffboardingController
);

// update task status
employeeOffboardingRouter.patch(
  "/task/:id/:taskName",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOffboardingController.updateOffboardingTaskStatusController
);

// get single data
employeeOffboardingRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  employeeOffboardingController.getEmployeeOffboardingController
);

// update data
employeeOffboardingRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOffboardingController.updateEmployeeOffboardingController
);

// delete data
employeeOffboardingRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeOffboardingController.deleteEmployeeOffboardingController
);

export default employeeOffboardingRouter;
