"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const express_1 = __importDefault(require("express"));
const authentication_controller_1 = require("./authentication.controller");
const authenticationRouter = express_1.default.Router();
// password login
authenticationRouter.post("/password-login", authentication_controller_1.authenticationController.passwordLoginController);
// oauth login
authenticationRouter.post("/oauth-login", authentication_controller_1.authenticationController.oauthLoginController);
// token login
authenticationRouter.post("/token-login", authentication_controller_1.authenticationController.tokenLoginController);
// recovery password
authenticationRouter.post("/verify-user", authentication_controller_1.authenticationController.verifyUserController);
authenticationRouter.patch("/recovery-password", authentication_controller_1.authenticationController.resetPasswordController);
authenticationRouter.post("/verify-otp", authentication_controller_1.authenticationController.verifyTokenController);
authenticationRouter.post("/resend-otp", authentication_controller_1.authenticationController.resendOtpController);
authenticationRouter.patch("/update-password", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), authentication_controller_1.authenticationController.updatePasswordController);
exports.default = authenticationRouter;
//# sourceMappingURL=authentication.route.js.map