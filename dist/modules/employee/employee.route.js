"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_controller_1 = require("./employee.controller");
const employeeRouter = express_1.default.Router();
// get all employee
employeeRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.getAllEmployeeController);
// get single employee
employeeRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.USER, roles_1.ENUM_ROLE.MODERATOR), employee_controller_1.employeeController.getSingleEmployeeController);
// insert employee
employeeRouter.post("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_controller_1.employeeController.createEmployeeController);
// update employee data
employeeRouter.patch("/update/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeeController);
// update employee note
employeeRouter.patch("/update-note/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.updateEmployeeNoteController);
// delete testimonial
employeeRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.deleteEmployeeController);
exports.default = employeeRouter;
//# sourceMappingURL=employee.route.js.map