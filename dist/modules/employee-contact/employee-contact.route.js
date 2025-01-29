"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_contact_controller_1 = require("./employee-contact.controller");
const employeeContactRouter = express_1.default.Router();
// get all data
employeeContactRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_contact_controller_1.employeeContactController.getAllEmployeeContactController);
// get single data
employeeContactRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_contact_controller_1.employeeContactController.getEmployeeContactController);
// update data
employeeContactRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_contact_controller_1.employeeContactController.updateEmployeeContactController);
// delete data
employeeContactRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_contact_controller_1.employeeContactController.deleteEmployeeContactController);
exports.default = employeeContactRouter;
//# sourceMappingURL=employee-contact.route.js.map