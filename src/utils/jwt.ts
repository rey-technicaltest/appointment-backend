import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomException } from "./customException";
import { EXCEPTION_MESSAGE } from "./exceptionMessage";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

interface TokenPayload {
  user_id: number;
  username: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error: any) {
    throw new CustomException(EXCEPTION_MESSAGE.UNAUTHORIZED, {
      message: "Invalid or expired token",
    });
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  return jwt.decode(token) as JwtPayload | null;
};
