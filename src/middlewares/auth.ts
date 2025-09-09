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
      const verifyToken = `${token.split(" ")[1]}`;

      // Try to verify with user secret first, then admin secret
      let verifiedToken: any;
      let jwtSecret: string | undefined;

      jwtSecret = config.jwt_secret;
      verifiedToken = jwtHelpers.verifyToken(verifyToken, jwtSecret as Secret);
      req.user = verifiedToken;

      if (
        requestRoles?.length &&
        !requestRoles?.includes(verifiedToken?.role)
      ) {
        throw new ApiError("User is not Authenticated", 403, "");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
