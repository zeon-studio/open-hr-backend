import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { employeeJobController } from "./employee-job.controller";

const employeeJobRouter = express.Router();

// get all data
employeeJobRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN),
  employeeJobController.getAllEmployeeJobController
);

// get single data
employeeJobRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  employeeJobController.getEmployeeJobController
);

// update data
employeeJobRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeJobController.updateEmployeeJobController
);

// delete data
employeeJobRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeJobController.deleteEmployeeJobController
);

export default employeeJobRouter;
