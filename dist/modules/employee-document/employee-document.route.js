"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_document_controller_1 = require("./employee-document.controller");
const employeeDocumentRouter = express_1.default.Router();
// get all data
employeeDocumentRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_document_controller_1.employeeDocumentController.getAllEmployeeDocumentController);
// get single data
employeeDocumentRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_document_controller_1.employeeDocumentController.getEmployeeDocumentController);
// update data
employeeDocumentRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_document_controller_1.employeeDocumentController.updateEmployeeDocumentController);
// delete data
employeeDocumentRouter.delete("/:employeeId/:documentId", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_document_controller_1.employeeDocumentController.deleteEmployeeDocumentController);
exports.default = employeeDocumentRouter;
//# sourceMappingURL=employee-document.route.js.map