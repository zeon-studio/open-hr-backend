import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { employeeController } from "./employee.controller";

const employeeRouter = express.Router();

// get all employee
employeeRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeController.getAllEmployeeController
);

// get all employee id
employeeRouter.get(
  "/basics",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.getAllEmployeeBasicsController
);

// get admin and mods
employeeRouter.get(
  "/admin-and-mods",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeController.getAdminAndModsController
);

// get single employee by invite token
employeeRouter.get(
  "/invite-token/:inviteToken",
  checkToken,
  // auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.getSingleEmployeeByInviteTokenController
);

// get single employee
employeeRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.USER, ENUM_ROLE.MODERATOR),
  employeeController.getSingleEmployeeController
);

// insert employee
employeeRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeController.createEmployeeController
);

// update employee data
employeeRouter.patch(
  "/update/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeeController
);

// update employee email
employeeRouter.patch(
  "/email/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeeEmailController
);

// update employee discord
employeeRouter.patch(
  "/discord/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeeDiscordController
);

// update employee personality
employeeRouter.patch(
  "/personality/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeController.updateEmployeePersonalityController
);

// update employee role
employeeRouter.patch(
  "/role/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeController.updateEmployeeRoleController
);

// delete testimonial
employeeRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeController.deleteEmployeeController
);

export default employeeRouter;
