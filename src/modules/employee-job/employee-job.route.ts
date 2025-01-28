import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { employeeJobController } from "./employee-job.controller";

const employeeJobRouter = express.Router();

// get all data
employeeJobRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeJobController.getAllEmployeeJobController
);

// get single data
employeeJobRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeJobController.getEmployeeJobController
);

// promote employee
employeeJobRouter.post(
  "/promote/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeJobController.promoteEmployeeController
);

// update data
employeeJobRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeJobController.updateEmployeeJobController
);

// delete data
employeeJobRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeJobController.deleteEmployeeJobController
);

export default employeeJobRouter;
