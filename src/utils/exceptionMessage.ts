import { Response } from "express";
import logger from "./logger";

export interface ExceptionType {
  code: number;
  status: string;
  level: "info" | "warn" | "error";
}

export const EXCEPTION_MESSAGE: Record<string, ExceptionType> = {
  SUCCESS: {
    code: 200,
    status: "SUCCESS",
    level: "info",
  },
  CREATED: {
    code: 201,
    status: "SUCCESS",
    level: "info",
  },
  BAD_REQUEST: {
    code: 400,
    status: "BAD_REQUEST",
    level: "warn",
  },
  UNAUTHORIZED: {
    code: 401,
    status: "UNAUTHORIZED",
    level: "warn",
  },
  FORBIDDEN: {
    code: 403,
    status: "FORBIDDEN",
    level: "warn",
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    status: "UNPROCESSABLE_ENTITY",
    level: "warn",
  },
  PROCESSING_ERROR: {
    code: 500,
    status: "PROCESSING_ERROR",
    level: "error",
  },
};

export const responseHandler = (
  res: Response,
  exception: ExceptionType,
  context: any,
  isError: boolean = false
) => {
  const { code, status, level } = exception;

  if (isError) {
    const errorObj = {
      status,
      message: typeof context === "string" ? context : "ERROR",
      ...(context?.details && { details: context.details }),
    };

    logger.log(level, {
      ...errorObj,
      timestamp: new Date().toISOString(),
    });

    return res.status(code).json(errorObj);
  }

  return res.status(code).json({
    status,
    message: "SUCCESS",
    data: context,
  });
};
