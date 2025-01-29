import config from "@/config/variables";
import catchAsync from "@/lib/catchAsync";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { sendResponse } from "@/lib/sendResponse";
import { checkToken } from "@/middlewares/checkToken";
import express, { Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { Employee } from "../employee/employee.model";

const authenticationRouter = express.Router();

export type EmployeeLoginType = {
  employee_id: string;
  email: string;
  name: string;
  role: string;
};

const loginService = async (email: string) => {
  const loginUser = await Employee.findOne({ work_email: email });

  if (!loginUser) {
    throw new Error("User not found");
  }

  const userDetails = {
    userId: loginUser.id,
    name: loginUser.name,
    email: loginUser.work_email,
    image: loginUser.image,
    role: loginUser.role || "user",
    accessToken: "",
  };
  const token = jwtHelpers.createToken(
    { user_id: loginUser.id, role: loginUser.role },
    config.jwt_secret as Secret,
    config.jwt_expire as string
  );

  userDetails.accessToken = token;

  return userDetails;
};

const loginWithTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const { token } = req.body;
    const decodedToken = jwtHelpers.verifyToken(
      token,
      config.jwt_secret as Secret
    );

    const userId = decodedToken.id;
    const employee = await Employee.findOne({ id: userId });

    if (!employee) {
      throw new Error("User not found");
    }

    const userDetails = {
      userId: employee.id,
      name: employee.name,
      email: employee.work_email,
      image: employee.image,
      role: employee.role || "user",
      accessToken: "",
    };

    const accessToken = jwtHelpers.createToken(
      { user_id: employee.id, role: employee.role },
      config.jwt_secret as Secret,
      config.jwt_expire as string
    );

    userDetails.accessToken = accessToken;
    sendResponse(res, {
      success: true,
      statusCode: 200,
      result: userDetails,
      message: "user logged in successfully",
    });
  }
);

const loginController = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const userDetails = await loginService(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: userDetails,
    message: "user logged in successfully",
  });
});

authenticationRouter.post("/login", checkToken, loginController);

authenticationRouter.post("/login-with-token", loginWithTokenController);

export default authenticationRouter;
