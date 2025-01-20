import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { assetController } from "./asset.controller";

const assetRouter = express.Router();

// get all data
assetRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  assetController.getAllAssetController
);

// get asset by user
assetRouter.get(
  "/user/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  assetController.getAssetsByUserController
);

// get single data
assetRouter.get(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  assetController.getAssetController
);

// create data
assetRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  assetController.createAssetController
);

// update data
assetRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  assetController.updateAssetController
);

// delete data
assetRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  assetController.deleteAssetController
);

export default assetRouter;
