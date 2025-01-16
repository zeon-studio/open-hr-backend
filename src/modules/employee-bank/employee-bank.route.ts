import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { employeeBankController } from "./employee-bank.controller";

const employeeBankRouter = express.Router();

// get all data
employeeBankRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeBankController.getAllEmployeeBankController
);

// get single data
employeeBankRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeBankController.getEmployeeBankController
);

// update data
employeeBankRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  employeeBankController.updateEmployeeBankController
);

// delete data
employeeBankRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeBankController.deleteEmployeeBankController
);

export default employeeBankRouter;
