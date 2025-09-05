import { Request, Response, NextFunction } from "express";
import {
  loginValidate,
  loginInputDto,
  registerInputDto,
  registerValidate,
} from "./auth.validation";
import { ValidationError } from "../../utils/app.error";
import { UtilsService } from "../../utils/utils.service";
import { AuthService } from "./auth.service";
import logger from "../../utils/logger";
import { UserDTO } from "./auth.dto";

export class AuthController {
  static async register(
    req: Request<{}, {}, registerInputDto>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const body = req.body;
      const { errorMsg, success } = registerValidate(body);

      if (!success) {
        logger.warn(`Validation error: ${errorMsg}`);
        return UtilsService.sendError(
          res,
          new ValidationError(errorMsg || "Validation failed"),
          400
        );
      }

      const user = await AuthService.createUser(body);

      return UtilsService.sendSuccess(
        res,
        {
          message: "User registered successfully",
          user: UserDTO.toResponse(user),
        },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request<{}, {}, loginInputDto>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const body = req.body;

      // Validate input
      const { errorMsg, success } = loginValidate(body);
      if (!success) {
        return UtilsService.sendError(
          res,
          new ValidationError(errorMsg || "Validation failed"),
          400
        );
      }

      // Verify Firebase token + generate JWT
      const { user, accessToken, refreshToken } =
        await AuthService.verifyFirebaseToken(body.idToken);

      // Set refresh token in httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      return UtilsService.sendSuccess(
        res,
        {
          message: "Login successful",
          user: UserDTO.toResponse(user),
          accessToken,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return UtilsService.sendError(
          res,
          new Error("User not authenticated"),
          401
        );
      }

      const user = await AuthService.findUserById(userId);

      if (!user) {
        return UtilsService.sendError(res, new Error("User not found"), 404);
      }

      return UtilsService.sendSuccess(
        res,
        {
          user: UserDTO.toResponse(user),
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      // 1️⃣ Cookie se refresh token lo
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return UtilsService.sendError(
          res,
          new Error("Refresh token required"),
          401
        );
      }

      // 2️⃣ Refresh token verify karo
      let decoded: any;
      try {
        decoded = AuthService.verifyRefreshToken(refreshToken);
      } catch (err) {
        return UtilsService.sendError(
          res,
          new Error("Invalid refresh token"),
          401
        );
      }

      // 3️⃣ User fetch karo
      const user = await AuthService.findUserById(decoded.id);
      if (!user) {
        return UtilsService.sendError(res, new Error("User not found"), 404);
      }

      // 4️⃣ New tokens generate karo (rotation)
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const newAccessToken = AuthService.generateAccessToken(tokenPayload);
      const newRefreshToken = AuthService.generateRefreshToken(tokenPayload);

      // 5️⃣ New refresh token cookie me set karo
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      // 6️⃣ Response bhejo
      return UtilsService.sendSuccess(
        res,
        {
          accessToken: newAccessToken,
          // user: UserDTO.toResponse(user),
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      // Refresh token cookie clear karo
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // (Optional) Agar Redis/DB use karoge to yaha invalidate bhi karna hoga

      return UtilsService.sendSuccess(
        res,
        { message: "Logout successful" },
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
