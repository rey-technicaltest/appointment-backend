import User from "../models/User";
import { verifyToken } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    if (authHeader.split(" ")[0] != "Bearer") {
      return res.status(401).json({
        message: "Invalid token format",
        code: "INVALID_TOKEN_FORMAT",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.user_id);

    if (!user) return res.status(401).json({ message: "User not found" });

    req.body = {
      ...req.body,
      user_id: user.id,
      preferred_timezone: user.preferred_timezone,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
