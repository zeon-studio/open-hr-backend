"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const express_1 = __importDefault(require("express"));
const employee_controller_1 = require("./employee.controller");
const employeeRouter = express_1.default.Router();
// get all employee
employeeRouter.get("/", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_controller_1.employeeController.getAllEmployeeController);
// get all employee id
employeeRouter.get("/basics", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.getAllEmployeeBasicsController);
// get admin and mods
employeeRouter.get("/admin-and-mods", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.getAdminAndModsController);
// get single employee by invite token
employeeRouter.get("/invite-token/:inviteToken", employee_controller_1.employeeController.getSingleEmployeeByInviteTokenController);
// get single employee
employeeRouter.get("/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER, roles_1.ENUM_ROLE.FORMER), employee_controller_1.employeeController.getSingleEmployeeController);
// insert employee
employeeRouter.post("/", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_controller_1.employeeController.createEmployeeController);
// update employee data
employeeRouter.patch("/update/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeeController);
// update employee email
employeeRouter.patch("/email/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeeEmailController);
// update employee password
employeeRouter.patch("/password/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeePasswordController);
// update employee communication_id
employeeRouter.patch("/communication_id/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeeCommunicationIdController);
// update employee personality
employeeRouter.patch("/personality/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeePersonalityController);
// update employee role
employeeRouter.patch("/role/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.updateEmployeeRoleController);
// delete testimonial
employeeRouter.delete("/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.deleteEmployeeController);
exports.default = employeeRouter;
//# sourceMappingURL=employee.route.js.map