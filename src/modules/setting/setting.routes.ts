import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { settingController } from "./setting.controller";

const settingRouter = express.Router();

// get single data
settingRouter.get("/", checkToken, settingController.getSettingController);

// update data
settingRouter.patch(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  settingController.updateSettingController
);

// update module status
settingRouter.patch(
  "/update-module",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  settingController.updateModuleStatusController
);

export default settingRouter;
