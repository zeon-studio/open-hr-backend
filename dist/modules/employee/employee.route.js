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
employeeRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_controller_1.employeeController.getAllEmployeeController);
// get all employee id
employeeRouter.get("/basics", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.getAllEmployeeBasicsController);
// get admin and mods
employeeRouter.get("/admin-and-mods", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.getAdminAndModsController);
// get single employee by invite token
employeeRouter.get("/invite-token/:inviteToken", checkToken_1.checkToken, employee_controller_1.employeeController.getSingleEmployeeByInviteTokenController);
// get single employee
employeeRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER, roles_1.ENUM_ROLE.FORMER), employee_controller_1.employeeController.getSingleEmployeeController);
// insert employee
employeeRouter.post("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_controller_1.employeeController.createEmployeeController);
// update employee data
employeeRouter.patch("/update/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeeController);
// update employee email
employeeRouter.patch("/email/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeeEmailController);
// update employee password
employeeRouter.patch("/password/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeePasswordController);
// update employee communication_id
employeeRouter.patch("/communication_id/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeeCommunicationIdController);
// update employee personality
employeeRouter.patch("/personality/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_controller_1.employeeController.updateEmployeePersonalityController);
// update employee role
employeeRouter.patch("/role/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.updateEmployeeRoleController);
// delete testimonial
employeeRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_controller_1.employeeController.deleteEmployeeController);
exports.default = employeeRouter;
//# sourceMappingURL=employee.route.js.map