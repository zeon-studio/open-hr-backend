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

// get payroll basics
payrollRouter.get(
  "/basics",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  payrollController.getPayrollBasicsController
);

// create monthly data
payrollRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  payrollController.createMonthlyPayrollController
);

// get single data
payrollRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
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
