"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_education_controller_1 = require("./employee-education.controller");
const employeeEducationRouter = express_1.default.Router();
// get all data
employeeEducationRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_education_controller_1.employeeEducationController.getAllEmployeeEducationController);
// get single data
employeeEducationRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_education_controller_1.employeeEducationController.getEmployeeEducationController);
// update data
employeeEducationRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_education_controller_1.employeeEducationController.updateEmployeeEducationController);
// delete data
employeeEducationRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_education_controller_1.employeeEducationController.deleteEmployeeEducationController);
exports.default = employeeEducationRouter;
//# sourceMappingURL=employee-education.route.js.map