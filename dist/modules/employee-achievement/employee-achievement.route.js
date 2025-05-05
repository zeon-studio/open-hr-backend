"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_achievement_controller_1 = require("./employee-achievement.controller");
const employeeAchievementRouter = express_1.default.Router();
// get all data
employeeAchievementRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_achievement_controller_1.employeeAchievementController.getAllEmployeeAchievementController);
// get single data
employeeAchievementRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER, roles_1.ENUM_ROLE.FORMER), employee_achievement_controller_1.employeeAchievementController.getEmployeeAchievementController);
// update data
employeeAchievementRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), employee_achievement_controller_1.employeeAchievementController.updateEmployeeAchievementController);
// delete data
employeeAchievementRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_achievement_controller_1.employeeAchievementController.deleteEmployeeAchievementController);
exports.default = employeeAchievementRouter;
//# sourceMappingURL=employee-achievement.route.js.map