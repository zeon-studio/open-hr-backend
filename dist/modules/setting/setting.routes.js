"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const setting_controller_1 = require("./setting.controller");
const settingRouter = express_1.default.Router();
// get single data
settingRouter.get("/", checkToken_1.checkToken, setting_controller_1.settingController.getSettingController);
// update data
settingRouter.patch("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), setting_controller_1.settingController.updateSettingController);
// update module status
settingRouter.patch("/update-module", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), setting_controller_1.settingController.updateModuleStatusController);
exports.default = settingRouter;
//# sourceMappingURL=setting.routes.js.map