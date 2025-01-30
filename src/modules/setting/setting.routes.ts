import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { settingController } from "./setting.controller";

const settingRouter = express.Router();

// get single data
settingRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  settingController.getSettingController
);

// update data
settingRouter.patch(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  settingController.updateSettingController
);

export default settingRouter;
