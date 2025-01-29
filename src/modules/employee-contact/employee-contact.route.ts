import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { employeeContactController } from "./employee-contact.controller";

const employeeContactRouter = express.Router();

// get all data
employeeContactRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeContactController.getAllEmployeeContactController
);

// get single data
employeeContactRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeContactController.getEmployeeContactController
);

// update data
employeeContactRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeContactController.updateEmployeeContactController
);

// delete data
employeeContactRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeContactController.deleteEmployeeContactController
);

export default employeeContactRouter;
