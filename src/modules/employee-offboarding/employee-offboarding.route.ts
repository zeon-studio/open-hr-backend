import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { employeeOffboardingController } from "./employee-offboarding.controller";

const employeeOffboardingRouter = express.Router();

// get all data
employeeOffboardingRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeOffboardingController.getAllEmployeeOffboardingController
);

// get single data
employeeOffboardingRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.USER),
  employeeOffboardingController.getEmployeeOffboardingController
);

// update data
employeeOffboardingRouter.patch(
  "/:id",
  checkToken,
  employeeOffboardingController.updateEmployeeOffboardingController
);

// delete data
employeeOffboardingRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeOffboardingController.deleteEmployeeOffboardingController
);

export default employeeOffboardingRouter;
