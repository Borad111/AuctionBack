import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env";

// ✅ Properly validate and type environment variables
const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET as string;

// ✅ Validate that secrets are provided
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are not configured");
}

// ✅ Parse expiry times with proper validation
const ACCESS_TOKEN_EXPIRY = (env.ACCESS_TOKEN_EXPIRY || "15m") as jwt.SignOptions['expiresIn'];
const REFRESH_TOKEN_EXPIRY = (env.REFRESH_TOKEN_EXPIRY || "7d") as jwt.SignOptions['expiresIn'];

export const JwtService = {
  generateAccessToken: (payload: object): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { 
      expiresIn: ACCESS_TOKEN_EXPIRY,
      algorithm: "HS256", // ✅ algo explicitly set (default bhi yahi hai, but safe to declare)
    });
  },

  generateRefreshToken: (payload: object): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { 
      expiresIn: REFRESH_TOKEN_EXPIRY,
      algorithm: "HS256",
    });
  },

  verifyAccessToken: (token: string): JwtPayload & { id: string; email: string; role: string } => {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload & {
        id: string;
        email: string;
        role: string;
      };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Access token expired");
      }
      throw new Error("Invalid access token");
    }
  },

  verifyRefreshToken: (token: string): JwtPayload & { id: string; email: string; role: string } => {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload & {
        id: string;
        email: string;
        role: string;
      };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Refresh token expired");
      }
      throw new Error("Invalid refresh token");
    }
  },
};
