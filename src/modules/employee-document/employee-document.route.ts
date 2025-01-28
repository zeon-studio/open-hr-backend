import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { employeeDocumentController } from "./employee-document.controller";

const employeeDocumentRouter = express.Router();

// get all data
employeeDocumentRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeDocumentController.getAllEmployeeDocumentController
);

// get single data
employeeDocumentRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeDocumentController.getEmployeeDocumentController
);

// update data
employeeDocumentRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeDocumentController.updateEmployeeDocumentController
);

// delete data
employeeDocumentRouter.delete(
  "/:employeeId/:documentId",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  employeeDocumentController.deleteEmployeeDocumentController
);

export default employeeDocumentRouter;
