import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error";
import { JwtService } from "../utils/jwt.service";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token required", 401);
    }

    const token = authHeader.substring(7);

    // Verify access token using JwtService
    const decoded = JwtService.verifyAccessToken(token) as {
      id: string;
      email: string;
      role: string;
      iat?: number;
      exp?: number;
    };

    // ✅ Now TypeScript will know about req.user
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.message === "Invalid access token") {
      next(new AppError("Invalid or expired token", 401));
    } else {
      next(new AppError("Authentication failed", 401));
    }
  }
};