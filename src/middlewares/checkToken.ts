import config from "@/config/variables";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { sendResponse } from "@/lib/sendResponse";
import { RequestHandler } from "express";
import { Secret } from "jsonwebtoken";

// check token
export const checkToken: RequestHandler = (req, res, next) => {
  const { authorization_token }: any = req.headers;
  try {
    const token = authorization_token.split(" ")[1];
    if (token === config.bearer_token) {
      next();
    }
  } catch (error) {
    next("authorization failed");
  }
};

// check invite token
export const checkInviteToken: RequestHandler = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    jwtHelpers.verifyToken(token, config.jwt_secret as Secret);
    next();
  } catch (error) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid token",
    });
  }
};
