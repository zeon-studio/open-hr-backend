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
  auth(ENUM_ROLE.ADMIN),
  employeeController.getAllEmployeeController
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
  employeeController.createEmployeeController
);

// update employee data
employeeRouter.patch(
  "/update/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.USER),
  employeeController.updateEmployeeController
);

// update employee note
employeeRouter.patch(
  "/update-note/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeController.updateEmployeeNoteController
);

// delete testimonial
employeeRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeController.deleteEmployeeController
);

export default employeeRouter;
