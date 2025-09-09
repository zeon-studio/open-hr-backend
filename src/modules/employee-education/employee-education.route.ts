import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { employeeEducationController } from "./employee-education.controller";

const employeeEducationRouter = express.Router();

// get all data
employeeEducationRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeEducationController.getAllEmployeeEducationController
);

// get single data
employeeEducationRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeEducationController.getEmployeeEducationController
);

// update data
employeeEducationRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeEducationController.updateEmployeeEducationController
);

// delete data
employeeEducationRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeEducationController.deleteEmployeeEducationController
);

export default employeeEducationRouter;
