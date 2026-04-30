import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import requireSelfOrPrivileged from "@/middlewares/requireSelfOrPrivileged";
import express from "express";
import { employeeBankController } from "./employee-bank.controller";

const employeeBankRouter = express.Router();

// get all data
employeeBankRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeBankController.getAllEmployeeBankController
);

// get single data
employeeBankRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  requireSelfOrPrivileged("id"),
  employeeBankController.getEmployeeBankController
);

// update data
employeeBankRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  requireSelfOrPrivileged("id"),
  employeeBankController.updateEmployeeBankController
);

// delete data
employeeBankRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  employeeBankController.deleteEmployeeBankController
);

export default employeeBankRouter;
