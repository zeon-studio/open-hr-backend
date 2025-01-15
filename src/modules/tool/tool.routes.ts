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
  auth(ENUM_ROLE.ADMIN),
  toolController.getAllToolController
);

// get single data
toolRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.USER),
  toolController.getToolController
);

// create data
toolRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  toolController.createToolController
);

// update data
toolRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
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
