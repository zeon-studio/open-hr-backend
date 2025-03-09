import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { authenticationController } from "./authentication.controller";

const authenticationRouter = express.Router();

// password login
authenticationRouter.post(
  "/password-login",
  checkToken,
  authenticationController.passwordLoginController
);

// oauth login
authenticationRouter.post(
  "/oauth-login",
  checkToken,
  authenticationController.oauthLoginController
);

// token login
authenticationRouter.post(
  "/token-login",
  checkToken,
  authenticationController.tokenLoginController
);

// recovery password
authenticationRouter.post(
  "/verify-user",
  checkToken,
  authenticationController.verifyUserController
);

authenticationRouter.patch(
  "/recovery-password",
  checkToken,
  authenticationController.resetPasswordController
);

authenticationRouter.post(
  "/verify-otp",
  checkToken,
  authenticationController.verifyTokenController
);

authenticationRouter.post(
  "/resend-otp",
  checkToken,
  authenticationController.resendOtpController
);

authenticationRouter.patch(
  "/update-password",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  authenticationController.updatePasswordController
);

export default authenticationRouter;
