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

export const settingService = {
  getSettingService,
  updateSettingService,
  getWeekendsService,
  getLeaveAllottedDays,
};
