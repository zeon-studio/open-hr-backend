"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_job_controller_1 = require("./employee-job.controller");
const employeeJobRouter = express_1.default.Router();
// get all data
employeeJobRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_job_controller_1.employeeJobController.getAllEmployeeJobController);
// get single data
employeeJobRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER, roles_1.ENUM_ROLE.FORMER), employee_job_controller_1.employeeJobController.getEmployeeJobController);
// update data
employeeJobRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_job_controller_1.employeeJobController.updateEmployeeJobController);
// delete data
employeeJobRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_job_controller_1.employeeJobController.deleteEmployeeJobController);
exports.default = employeeJobRouter;
//# sourceMappingURL=employee-job.route.js.map