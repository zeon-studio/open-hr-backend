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

const loginService = async (user: EmployeeLoginType) => {
  const loginUser = await Employee.findOne({ work_email: user.email });

  if (!loginUser) {
    throw new Error("User not found");
  }

  const userDetails = {
    name: loginUser.name,
    email: loginUser.work_email,
    userId: loginUser.id,
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

const loginController = catchAsync(async (req: Request, res: Response) => {
  const { user } = req.body;
  const userDetails = await loginService(user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    result: userDetails,
    message: "user logged in successfully",
  });
});

authenticationRouter.post("/login", checkToken, loginController);

export default authenticationRouter;
