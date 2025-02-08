import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { payrollController } from "./payroll.controller";

const payrollRouter = express.Router();

// get all data
payrollRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  payrollController.getAllPayrollController
);

// get single data
payrollRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  payrollController.getPayrollController
);

// update data
payrollRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  payrollController.updatePayrollController
);

// delete data
payrollRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  payrollController.deletePayrollController
);

export default payrollRouter;
