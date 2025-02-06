"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingController = void 0;
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const sendResponse_1 = require("../../lib/sendResponse");
const setting_service_1 = require("./setting.service");
// get single data
const getSettingController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield setting_service_1.settingService.getSettingService();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: setting,
        message: "data get successfully",
    });
}));
// update data
const updateSettingController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = req.body;
    yield setting_service_1.settingService.updateSettingService(updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
    });
}));
// update module status
const updateModuleStatusController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, enable } = req.body;
    const updatedModule = yield setting_service_1.settingService.updateModuleStatusService(name, enable);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: updatedModule,
        message: "Module status updated successfully",
    });
}));
exports.settingController = {
    getSettingController,
    updateSettingController,
    updateModuleStatusController,
};
//# sourceMappingURL=setting.controller.js.map