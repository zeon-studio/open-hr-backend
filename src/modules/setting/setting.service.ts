import { Setting } from "./setting.model";
import { SettingType } from "./setting.type";

// get single data
const getSettingService = async () => {
  const result = await Setting.findOne();
  return result;
};

// update
const updateSettingService = async (updateData: Partial<SettingType>) => {
  const result = await Setting.findOneAndUpdate(
    {},
    { $set: updateData },
    {
      new: true,
    }
  );
  return result;
};

// update module
const updateModuleStatusService = async (name: string, enable: boolean) => {
  const setting = await Setting.findOne().exec();
  if (!setting) {
    throw new Error("Settings not found");
  }
  const module = setting.modules.find((mod) => mod.name === name);
  if (!module) {
    setting.modules.push({ name, enable });
  } else {
    module.enable = enable;
  }
  await setting.save();
  return module;
};

// get weekends and conditional weekends
const getWeekendsService = async () => {
  const setting = await Setting.findOne().exec();
  if (!setting) {
    throw new Error("Settings not found");
  }
  return {
    weekends: setting.weekends,
    conditionalWeekends: setting.conditional_weekends,
  };
};

// get leave allotted days
const getLeaveAllottedDays = async () => {
  const setting = await Setting.findOne().exec();
  if (!setting) {
    throw new Error("Settings not found");
  }
  const leaveAllottedDays: { [key: string]: number } = {};
  setting.leaves.forEach((leave) => {
    leaveAllottedDays[leave.name] = leave.days;
  });
  return leaveAllottedDays;
};

// get onboarding tasks
const getOnboardingTasksService = async () => {
  const setting = await Setting.findOne().exec();
  if (!setting) {
    throw new Error("Settings not found");
  }
  return setting.onboarding_tasks;
};

// get offboarding tasks
const getOffboardingTasksService = async () => {
  const setting = await Setting.findOne().exec();
  if (!setting) {
    throw new Error("Settings not found");
  }
  return setting.offboarding_tasks;
};

export const settingService = {
  getSettingService,
  updateSettingService,
  updateModuleStatusService,
  getWeekendsService,
  getLeaveAllottedDays,
  getOnboardingTasksService,
  getOffboardingTasksService,
};
