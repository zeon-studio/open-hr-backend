"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const authentication_controller_1 = require("./authentication.controller");
const authenticationRouter = express_1.default.Router();
// password login
authenticationRouter.post("/password-login", checkToken_1.checkToken, authentication_controller_1.authenticationController.passwordLoginController);
// oauth login
authenticationRouter.post("/oauth-login", checkToken_1.checkToken, authentication_controller_1.authenticationController.oauthLoginController);
// token login
authenticationRouter.post("/token-login", checkToken_1.checkToken, authentication_controller_1.authenticationController.tokenLoginController);
// recovery password
authenticationRouter.post("/verify-user", checkToken_1.checkToken, authentication_controller_1.authenticationController.verifyUserController);
authenticationRouter.patch("/recovery-password", checkToken_1.checkToken, authentication_controller_1.authenticationController.resetPasswordController);
authenticationRouter.post("/verify-otp", checkToken_1.checkToken, authentication_controller_1.authenticationController.verifyTokenController);
authenticationRouter.post("/resend-otp", checkToken_1.checkToken, authentication_controller_1.authenticationController.resendOtpController);
authenticationRouter.patch("/update-password", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), authentication_controller_1.authenticationController.updatePasswordController);
// refresh token
authenticationRouter.post("/refresh-token", authentication_controller_1.authenticationController.refreshTokenController);
exports.default = authenticationRouter;
//# sourceMappingURL=authentication.route.js.map