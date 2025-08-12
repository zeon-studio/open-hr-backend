import { JwtPayload } from "jsonwebtoken";
import { SortOrder } from "mongoose";

export type ErrorMessageType = {
  message: string;
  path: string;
};

export type ErrorResponseType = {
  errorMessage: ErrorMessageType[];
  statusCode: number;
  message: string;
};

export type PaginationType = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
};

declare global {
  namespace Express {
    interface Request {
      body: any;
      user?: JwtPayload | null;
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<import("mongoose").Mongoose> | null | undefined;
}
