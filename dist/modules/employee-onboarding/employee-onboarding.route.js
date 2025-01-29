"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_onboarding_controller_1 = require("./employee-onboarding.controller");
const employeeOnboardingRouter = express_1.default.Router();
// get all data
employeeOnboardingRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_onboarding_controller_1.employeeOnboardingController.getAllEmployeeOnboardingController);
// get pending onboarding task
employeeOnboardingRouter.get("/pending-task", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_onboarding_controller_1.employeeOnboardingController.getPendingOnboardingTaskController);
// update task status
employeeOnboardingRouter.patch("/task/:id/:taskName", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_onboarding_controller_1.employeeOnboardingController.updateOnboardingTaskStatusController);
// get single data
employeeOnboardingRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_onboarding_controller_1.employeeOnboardingController.getEmployeeOnboardingController);
// update data
employeeOnboardingRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_onboarding_controller_1.employeeOnboardingController.updateEmployeeOnboardingController);
// delete data
employeeOnboardingRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_onboarding_controller_1.employeeOnboardingController.deleteEmployeeOnboardingController);
exports.default = employeeOnboardingRouter;
//# sourceMappingURL=employee-onboarding.route.js.map