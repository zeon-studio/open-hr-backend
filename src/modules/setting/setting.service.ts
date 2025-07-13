import { Setting } from "./setting.model";
import { SettingType } from "./setting.type";

// Helper function to get settings with error handling
const getSettingsOrThrow = async () => {
  const settings = await Setting.findOne().exec();
  if (!settings) {
    throw new Error("Settings not found");
  }
  return settings;
};

// get single data
const getSettingService = async () => {
  const result = await Setting.findOne();
  return result;
};

// update
const updateSettingService = async (updateData: Partial<SettingType>) => {
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("Update data is required");
  }

  const result = await Setting.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true }
  );

  if (!result) {
    throw new Error("Settings not found");
  }

  return result;
};

// update module
const updateModuleStatusService = async (name: string, enable: boolean) => {
  if (!name || typeof enable !== "boolean") {
    throw new Error("Module name and enable status are required");
  }

  const setting = await getSettingsOrThrow();
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
  const setting = await getSettingsOrThrow();
  return {
    weekends: setting.weekends,
    conditionalWeekends: setting.conditional_weekends,
  };
};

// get leave allotted days
const getLeaveAllottedDays = async () => {
  const setting = await getSettingsOrThrow();
  const leaveAllottedDays: { [key: string]: number } = {};

  setting.leaves.forEach((leave) => {
    leaveAllottedDays[leave.name] = leave.days;
  });

  return leaveAllottedDays;
};

// get onboarding tasks
const getOnboardingTasksService = async () => {
  const setting = await getSettingsOrThrow();
  return setting.onboarding_tasks;
};

// get offboarding tasks
const getOffboardingTasksService = async () => {
  const setting = await getSettingsOrThrow();
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
