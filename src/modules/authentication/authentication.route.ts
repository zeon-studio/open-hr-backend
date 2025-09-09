import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { authenticationController } from "./authentication.controller";

const authenticationRouter = express.Router();

// password login
authenticationRouter.post(
  "/password-login",
  authenticationController.passwordLoginController
);

// oauth login
authenticationRouter.post(
  "/oauth-login",
  authenticationController.oauthLoginController
);

// token login
authenticationRouter.post(
  "/token-login",
  authenticationController.tokenLoginController
);

// recovery password
authenticationRouter.post(
  "/verify-user",
  authenticationController.verifyUserController
);

authenticationRouter.patch(
  "/recovery-password",
  authenticationController.resetPasswordController
);

authenticationRouter.post(
  "/verify-otp",
  authenticationController.verifyTokenController
);

authenticationRouter.post(
  "/resend-otp",
  authenticationController.resendOtpController
);

authenticationRouter.patch(
  "/update-password",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  authenticationController.updatePasswordController
);

export default authenticationRouter;
