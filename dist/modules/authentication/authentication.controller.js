"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationController = void 0;
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const sendResponse_1 = require("../../lib/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const authentication_service_1 = require("./authentication.service");
// password login
const passwordLoginController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield authentication_service_1.authenticationService.passwordLoginService(email, password);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: user,
        message: "user login successfully",
    });
}));
// oauth login
const oauthLoginController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield authentication_service_1.authenticationService.oauthLoginService(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: user,
        message: "data get successfully",
    });
}));
// token login
const tokenLoginController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const userDetails = yield authentication_service_1.authenticationService.tokenLoginService(token);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: userDetails,
        message: "user logged in successfully",
    });
}));
// verify user
const verifyUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield authentication_service_1.authenticationService.verifyUserService(req.body.email, req.body.currentTime);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "otp send successfully",
        result: user,
    });
}));
// verify token
const verifyTokenController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, currentTime } = req.body;
    yield authentication_service_1.authenticationService.verifyOtpService(email, otp, currentTime);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "user token verified successfully",
    });
}));
// reset password
const resetPasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    yield authentication_service_1.authenticationService.resetPasswordService(email, password);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "password reset successfully",
    });
}));
// update password
const updatePasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, current_password, new_password } = req.body;
    yield authentication_service_1.authenticationService.updatePasswordService(id, current_password, new_password);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "password update successfully",
    });
}));
//  resend otp
const resendOtpController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentTime, email } = req.body;
    yield authentication_service_1.authenticationService.resendOtpService(email, currentTime);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "otp resend successfully",
    });
}));
// refresh token
const refreshTokenController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    const token = yield authentication_service_1.authenticationService.refreshTokenService(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: token,
        message: "Token refreshed successfully",
    });
}));
exports.authenticationController = {
    passwordLoginController,
    oauthLoginController,
    tokenLoginController,
    verifyUserController,
    verifyTokenController,
    resendOtpController,
    resetPasswordController,
    updatePasswordController,
    refreshTokenController,
};
//# sourceMappingURL=authentication.controller.js.map