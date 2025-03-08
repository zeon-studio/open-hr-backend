import catchAsync from "@/lib/catchAsync";
import { sendResponse } from "@/lib/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { authenticationService } from "./authentication.service";

// password login
const passwordLoginController = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authenticationService.passwordLoginService(
      email,
      password
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: user,
      message: "user login successfully",
    });
  }
);

// oauth login
const oauthLoginController = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await authenticationService.oauthLoginService(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: user,
    message: "data get successfully",
  });
});

// token login
const tokenLoginController = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const userDetails = await authenticationService.tokenLoginService(token);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: userDetails,
    message: "user logged in successfully",
  });
});

// verify user
const verifyUserController = catchAsync(async (req, res) => {
  const user = await authenticationService.verifyUserService(
    req.body.email,
    req.body.currentTime
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "otp send successfully",
    result: user,
  });
});

// verify token
const verifyTokenController = catchAsync(async (req, res) => {
  const { email, otp, currentTime } = req.body;
  await authenticationService.verifyOtpService(email, otp, currentTime);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "user token verified successfully",
  });
});

// reset password
const resetPasswordController = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  await authenticationService.resetPasswordService(email, password);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password reset successfully",
  });
});

// update password
const updatePasswordController = catchAsync(async (req, res) => {
  const { id, current_password, new_password } = req.body;
  await authenticationService.updatePasswordService(
    id,
    current_password,
    new_password
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password update successfully",
  });
});

//  resend otp
const resendOtpController = catchAsync(async (req, res) => {
  const { currentTime, email } = req.body;
  await authenticationService.resendOtpService(email, currentTime);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "otp resend successfully",
  });
});

// refresh token
const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens =
      await authenticationService.refreshTokenService(refreshToken);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: tokens,
      message: "Token refreshed successfully",
    });
  }
);

export const authenticationController = {
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
