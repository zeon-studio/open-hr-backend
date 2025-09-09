import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { settingController } from "./setting.controller";

const settingRouter = express.Router();

// get single data
settingRouter.get("/", settingController.getSettingController);

// update data
settingRouter.patch(
  "/",
  auth(ENUM_ROLE.ADMIN),
  settingController.updateSettingController
);

// update module status
settingRouter.patch(
  "/update-module",
  auth(ENUM_ROLE.ADMIN),
  settingController.updateModuleStatusController
);

export default settingRouter;
