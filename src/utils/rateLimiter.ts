import rateLimit from "express-rate-limit";

export const userRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  keyGenerator: (req: any) => {
    return req.user?.id || req.ip;
  },
  message: {
    status: "ERROR",
    message: "Too many requests for this user",
  },
});
