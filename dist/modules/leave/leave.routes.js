"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const leave_controller_1 = require("./leave.controller");
const leaveRouter = express_1.default.Router();
// get all data
leaveRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), leave_controller_1.leaveController.getAllLeaveController);
// add new year data
leaveRouter.patch("/update-year/:year", checkToken_1.checkToken, 
// auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
leave_controller_1.leaveController.addNewYearLeaveController);
// get single data
leaveRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), leave_controller_1.leaveController.getLeaveController);
// update data
leaveRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), leave_controller_1.leaveController.updateLeaveController);
// delete data
leaveRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), leave_controller_1.leaveController.deleteLeaveController);
exports.default = leaveRouter;
//# sourceMappingURL=leave.routes.js.map