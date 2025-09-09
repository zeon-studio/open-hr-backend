import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { payrollController } from "./payroll.controller";

const payrollRouter = express.Router();

// get all data
payrollRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  payrollController.getAllPayrollController
);

// get payroll basics
payrollRouter.get(
  "/basics",
  auth(ENUM_ROLE.ADMIN),
  payrollController.getPayrollBasicsController
);

// create monthly data
payrollRouter.post(
  "/",
  auth(ENUM_ROLE.ADMIN),
  payrollController.createMonthlyPayrollController
);

// get single data
payrollRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER, ENUM_ROLE.FORMER),
  payrollController.getPayrollController
);

// update data
payrollRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  payrollController.updatePayrollController
);

// delete data
payrollRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  payrollController.deletePayrollController
);

export default payrollRouter;
