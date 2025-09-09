import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { employeeController } from "./employee.controller";

const employeeRouter = express.Router();

// get all employee
employeeRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeController.getAllEmployeeController
);

// get all employee id
employeeRouter.get(
  "/basics",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.getAllEmployeeBasicsController
);

// get admin and mods
employeeRouter.get(
  "/admin-and-mods",
  auth(ENUM_ROLE.ADMIN),
  employeeController.getAdminAndModsController
);

// get single employee by invite token
employeeRouter.get(
  "/invite-token/:inviteToken",

  employeeController.getSingleEmployeeByInviteTokenController
);

// get single employee
employeeRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  employeeController.getSingleEmployeeController
);

// insert employee
employeeRouter.post(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeController.createEmployeeController
);

// update employee data
employeeRouter.patch(
  "/update/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeeController
);

// update employee email
employeeRouter.patch(
  "/email/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeeEmailController
);

// update employee password
employeeRouter.patch(
  "/password/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeePasswordController
);

// update employee communication_id
employeeRouter.patch(
  "/communication_id/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeeCommunicationIdController
);

// update employee personality
employeeRouter.patch(
  "/personality/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeePersonalityController
);

// update employee role
employeeRouter.patch(
  "/role/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeController.updateEmployeeRoleController
);

// delete testimonial
employeeRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeController.deleteEmployeeController
);

export default employeeRouter;
