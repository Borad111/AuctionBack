import { Request, Response, NextFunction } from "express";
import { registerValidate } from "./auth.validation";
import { ValidationError } from "../../utils/app.error";
import { UtilsService } from "../../utils/utils.service";
import { AuthService } from "./auth.service";
import logger from "../../utils/logger";

export class AuthController {
  static async register(
    req: Request,
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

      return  UtilsService.sendSuccess(
        res,
        {
          message: "User registered successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
        201
      );
    } catch (error) {
      next(error);
      return;
    }
  }
}
