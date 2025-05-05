"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_offboarding_controller_1 = require("./employee-offboarding.controller");
const employeeOffboardingRouter = express_1.default.Router();
// get all data
employeeOffboardingRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER, roles_1.ENUM_ROLE.FORMER), employee_offboarding_controller_1.employeeOffboardingController.getAllEmployeeOffboardingController);
// get pending onboarding task
employeeOffboardingRouter.get("/pending-task", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_offboarding_controller_1.employeeOffboardingController.getPendingOffboardingTaskController);
// create data
employeeOffboardingRouter.post("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_offboarding_controller_1.employeeOffboardingController.createEmployeeOffboardingController);
// update task status
employeeOffboardingRouter.patch("/task/:id/:taskName", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_offboarding_controller_1.employeeOffboardingController.updateOffboardingTaskStatusController);
// get single data
employeeOffboardingRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_offboarding_controller_1.employeeOffboardingController.getEmployeeOffboardingController);
// update data
employeeOffboardingRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_offboarding_controller_1.employeeOffboardingController.updateEmployeeOffboardingController);
// delete data
employeeOffboardingRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_offboarding_controller_1.employeeOffboardingController.deleteEmployeeOffboardingController);
exports.default = employeeOffboardingRouter;
//# sourceMappingURL=employee-offboarding.route.js.map