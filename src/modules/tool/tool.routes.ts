import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { toolController } from "./tool.controller";

const toolRouter = express.Router();

// get all data
toolRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  toolController.getAllToolController
);

// get data by user
toolRouter.get(
  "/user/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  toolController.getToolByUserController
);

// get single data
toolRouter.get(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  toolController.getToolController
);

// create data
toolRouter.post(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  toolController.createToolController
);

// update data
toolRouter.patch(
  "/:id",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  toolController.updateToolController
);

// delete data
toolRouter.delete(
  "/:id",
  auth(ENUM_ROLE.ADMIN),
  toolController.deleteToolController
);

export default toolRouter;
