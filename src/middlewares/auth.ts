import config from "@/config/variables";
import ApiError from "@/errors/ApiError";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";

const auth =
  (...requestRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization as string;
      if (!token) {
        throw new ApiError("User is not Authenticated", 401);
      }
      const verifyToken = `${token.split(" ")[1]}`;
      const verifiedToken = jwtHelpers.verifyToken(
        verifyToken,
        config.jwt_secret as Secret
      );
      req.user = verifiedToken;
      if (
        requestRoles?.length &&
        !requestRoles?.includes(verifiedToken?.role)
      ) {
        throw new ApiError("User is not Authenticated", 401);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
