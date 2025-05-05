"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const leave_request_controller_1 = require("./leave-request.controller");
const leaveRequestRouter = express_1.default.Router();
// get all data
leaveRequestRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER, roles_1.ENUM_ROLE.FORMER), leave_request_controller_1.leaveRequestController.getAllLeaveRequestController);
// get upcoming leave request
leaveRequestRouter.get("/upcoming/:current_date", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), leave_request_controller_1.leaveRequestController.getUpcomingLeaveRequestController);
// get upcoming leave request
leaveRequestRouter.get("/upcoming-dates/:current_date", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), leave_request_controller_1.leaveRequestController.getUpcomingLeaveRequestDatesController);
// get single data
leaveRequestRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), leave_request_controller_1.leaveRequestController.getLeaveRequestController);
// create data
leaveRequestRouter.post("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), leave_request_controller_1.leaveRequestController.createLeaveRequestController);
// update data
leaveRequestRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), leave_request_controller_1.leaveRequestController.updateLeaveRequestController);
// delete data
leaveRequestRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), leave_request_controller_1.leaveRequestController.deleteLeaveRequestController);
exports.default = leaveRequestRouter;
//# sourceMappingURL=leave-request.routes.js.map