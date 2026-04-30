import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import requireSelfOrPrivileged from "@/middlewares/requireSelfOrPrivileged";
import express from "express";
import { employeeDocumentController } from "./employee-document.controller";

const employeeDocumentRouter = express.Router();

// get all data
employeeDocumentRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  employeeDocumentController.getAllEmployeeDocumentController
);

// get single data
employeeDocumentRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  requireSelfOrPrivileged("id"),
  employeeDocumentController.getEmployeeDocumentController
);

// update data
employeeDocumentRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  requireSelfOrPrivileged("id"),
  employeeDocumentController.updateEmployeeDocumentController
);

// delete data
employeeDocumentRouter.delete(
  "/:employeeId/:documentId",
  auth(ENUM_ROLE.ADMIN),
  employeeDocumentController.deleteEmployeeDocumentController
);

export default employeeDocumentRouter;
