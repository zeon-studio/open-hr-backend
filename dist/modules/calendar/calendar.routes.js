"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const express_1 = __importDefault(require("express"));
const calendar_controller_1 = require("./calendar.controller");
const calendarRouter = express_1.default.Router();
// get all data
calendarRouter.get("/", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), calendar_controller_1.calendarController.getAllCalendarController);
// create data
calendarRouter.post("/", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), calendar_controller_1.calendarController.createCalendarController);
// get upcoming events and holidays
calendarRouter.get("/upcoming/:current_date", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), calendar_controller_1.calendarController.getUpcomingEventsAndHolidaysController);
// get single data
calendarRouter.get("/:year", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), calendar_controller_1.calendarController.getCalendarController);
// update data
calendarRouter.patch("/:year", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), calendar_controller_1.calendarController.updateCalendarController);
// delete data
calendarRouter.delete("/:year", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), calendar_controller_1.calendarController.deleteCalendarController);
exports.default = calendarRouter;
//# sourceMappingURL=calendar.routes.js.map