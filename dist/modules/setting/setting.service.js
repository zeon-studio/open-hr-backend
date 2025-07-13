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
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingService = void 0;
const setting_model_1 = require("./setting.model");
// Helper function to get settings with error handling
const getSettingsOrThrow = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield setting_model_1.Setting.findOne().exec();
    if (!settings) {
        throw new Error("Settings not found");
    }
    return settings;
});
// get single data
const getSettingService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_model_1.Setting.findOne();
    return result;
});
// update
const updateSettingService = (updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error("Update data is required");
    }
    const result = yield setting_model_1.Setting.findOneAndUpdate({}, { $set: updateData }, { new: true });
    if (!result) {
        throw new Error("Settings not found");
    }
    return result;
});
// update module
const updateModuleStatusService = (name, enable) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name || typeof enable !== "boolean") {
        throw new Error("Module name and enable status are required");
    }
    const setting = yield getSettingsOrThrow();
    const module = setting.modules.find((mod) => mod.name === name);
    if (!module) {
        setting.modules.push({ name, enable });
    }
    else {
        module.enable = enable;
    }
    yield setting.save();
    return module;
});
// get weekends and conditional weekends
const getWeekendsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield getSettingsOrThrow();
    return {
        weekends: setting.weekends,
        conditionalWeekends: setting.conditional_weekends,
    };
});
// get leave allotted days
const getLeaveAllottedDays = () => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield getSettingsOrThrow();
    const leaveAllottedDays = {};
    setting.leaves.forEach((leave) => {
        leaveAllottedDays[leave.name] = leave.days;
    });
    return leaveAllottedDays;
});
// get onboarding tasks
const getOnboardingTasksService = () => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield getSettingsOrThrow();
    return setting.onboarding_tasks;
});
// get offboarding tasks
const getOffboardingTasksService = () => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield getSettingsOrThrow();
    return setting.offboarding_tasks;
});
exports.settingService = {
    getSettingService,
    updateSettingService,
    updateModuleStatusService,
    getWeekendsService,
    getLeaveAllottedDays,
    getOnboardingTasksService,
    getOffboardingTasksService,
};
//# sourceMappingURL=setting.service.js.map