import { Setting } from "./setting.model";
import { SettingType } from "./setting.type";

// get single data
const getSettingService = async () => {
  const result = await Setting.find();
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

export const settingService = {
  getSettingService,
  updateSettingService,
};
