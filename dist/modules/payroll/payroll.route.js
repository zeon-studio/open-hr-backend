"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const payroll_controller_1 = require("./payroll.controller");
const payrollRouter = express_1.default.Router();
// get all data
payrollRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), payroll_controller_1.payrollController.getAllPayrollController);
// get payroll basics
payrollRouter.get("/basics", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), payroll_controller_1.payrollController.getPayrollBasicsController);
// create monthly data
payrollRouter.post("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), payroll_controller_1.payrollController.createMonthlyPayrollController);
// get single data
payrollRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER, roles_1.ENUM_ROLE.FORMER), payroll_controller_1.payrollController.getPayrollController);
// update data
payrollRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), payroll_controller_1.payrollController.updatePayrollController);
// delete data
payrollRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), payroll_controller_1.payrollController.deletePayrollController);
exports.default = payrollRouter;
//# sourceMappingURL=payroll.route.js.map