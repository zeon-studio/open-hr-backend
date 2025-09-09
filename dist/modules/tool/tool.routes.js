"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const express_1 = __importDefault(require("express"));
const tool_controller_1 = require("./tool.controller");
const toolRouter = express_1.default.Router();
// get all data
toolRouter.get("/", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), tool_controller_1.toolController.getAllToolController);
// get data by user
toolRouter.get("/user/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), tool_controller_1.toolController.getToolByUserController);
// get single data
toolRouter.get("/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), tool_controller_1.toolController.getToolController);
// create data
toolRouter.post("/", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), tool_controller_1.toolController.createToolController);
// update data
toolRouter.patch("/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), tool_controller_1.toolController.updateToolController);
// delete data
toolRouter.delete("/:id", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), tool_controller_1.toolController.deleteToolController);
exports.default = toolRouter;
//# sourceMappingURL=tool.routes.js.map