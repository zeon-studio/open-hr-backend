import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { toolController } from "./tool.controller";

const toolRouter = express.Router();

// get all data
toolRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  toolController.getAllToolController
);

// get data by user
toolRouter.get(
  "/user/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  toolController.getToolByUserController
);

// get single data
toolRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  toolController.getToolController
);

// update data
toolRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  toolController.updateToolController
);

// delete data
toolRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  toolController.deleteToolController
);

export default toolRouter;
