import config from "@/config/variables";
import { RequestHandler } from "express";

export const checkToken: RequestHandler = (req, res, next) => {
  const { authorization_token }: any = req.headers;
  try {
    if (
      authorization_token &&
      authorization_token.split(" ")[1] === config.bearer_token
    ) {
      next();
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    next(error);
  }
};
