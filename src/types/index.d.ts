import { JwtPayload } from "jsonwebtoken";
import { SortOrder } from "mongoose";

export enum ECurrency {
  BDT = "bdt",
  USD = "usd",
}

export enum EBilling {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  ONETIME = "onetime",
}

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
