import { Request, Response, NextFunction } from "express";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";

export const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return responseHandler(
        res,
        EXCEPTION_MESSAGE.UNAUTHORIZED,
        "Unauthenticated",
        true
      );
    }

    if (!roles.includes(req.body.role)) {
      return responseHandler(
        res,
        EXCEPTION_MESSAGE.FORBIDDEN,
        "Forbidden: insufficient role",
        true
      );
    }

    next();
  };
};
