import { ENUM_ROLE } from "@/enums/roles";
import ApiError from "@/errors/ApiError";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

// Allows the request through if either:
//   (a) the authenticated user's role is in `privilegedRoles`, OR
//   (b) the URL param `:<idParam>` matches the authenticated user's id.
//
// Must be mounted AFTER `auth(...)` so that req.user is populated.
//
// Defaults: ADMIN and MODERATOR are treated as privileged (they manage
// other employees). Pass an explicit list to narrow this (e.g., admin-only
// for password / role / financial mutations).
const requireSelfOrPrivileged =
  (
    idParam = "id",
    ...privilegedRoles: string[]
  ): ((req: Request, res: Response, next: NextFunction) => void) =>
  (req, res, next) => {
    const allowed =
      privilegedRoles.length > 0
        ? privilegedRoles
        : [ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR];

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return next(
        new ApiError("Unauthenticated", httpStatus.UNAUTHORIZED, "")
      );
    }

    if (allowed.includes(userRole)) return next();

    const targetId = req.params?.[idParam];
    if (targetId && targetId === userId) return next();

    return next(
      new ApiError(
        "You may only access your own record",
        httpStatus.FORBIDDEN,
        ""
      )
    );
  };

export default requireSelfOrPrivileged;
