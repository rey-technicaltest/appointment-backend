import { NextFunction, Request, Response } from "express";
import { EXCEPTION_MESSAGE } from "../utils/exceptionMessage";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errorType = err.errorType || EXCEPTION_MESSAGE.PROCESSING_ERROR;
    const message = err.systemLog?.message || err.message;
    const destination = err.systemLog?.destination || req.originalUrl;
    const userId = err.systemLog?.userId || (req as any)?.user?.id || null;

    return res.status(errorType.code).json({
      status: errorType.status,
      message,
    });
  } catch (logError) {
    console.error("Failed to log error:", logError);

    return res.status(500).json({
      status: "PROCESSING_ERROR",
      message: "Internal server error",
    });
  }
};
