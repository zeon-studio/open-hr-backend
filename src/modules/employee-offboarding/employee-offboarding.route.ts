import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { employeeOffboardingController } from "./employee-offboarding.controller";

const employeeOffboardingRouter = express.Router();

// get all data
employeeOffboardingRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  employeeOffboardingController.getAllEmployeeOffboardingController
);

// get pending onboarding task
employeeOffboardingRouter.get(
  "/pending-task",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOffboardingController.getPendingOffboardingTaskController
);

// create data
employeeOffboardingRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOffboardingController.createEmployeeOffboardingController
);

// update task status
employeeOffboardingRouter.patch(
  "/task/:id/:taskName",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOffboardingController.updateOffboardingTaskStatusController
);

// get single data
employeeOffboardingRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  employeeOffboardingController.getEmployeeOffboardingController
);

// update data
employeeOffboardingRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeOffboardingController.updateEmployeeOffboardingController
);

// delete data
employeeOffboardingRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeOffboardingController.deleteEmployeeOffboardingController
);

export default employeeOffboardingRouter;
