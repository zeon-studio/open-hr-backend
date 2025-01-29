"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_bank_controller_1 = require("./employee-bank.controller");
const employeeBankRouter = express_1.default.Router();
// get all data
employeeBankRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_bank_controller_1.employeeBankController.getAllEmployeeBankController);
// get single data
employeeBankRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_bank_controller_1.employeeBankController.getEmployeeBankController);
// update data
employeeBankRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), employee_bank_controller_1.employeeBankController.updateEmployeeBankController);
// delete data
employeeBankRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), employee_bank_controller_1.employeeBankController.deleteEmployeeBankController);
exports.default = employeeBankRouter;
//# sourceMappingURL=employee-bank.route.js.map