import { User } from "../../models/user.model";
import { UtilsService } from "../../utils/utils.service";
import { registerInput } from "./auth.validation";
import { AppError } from "../../utils/app.error";
import logger from "../../utils/logger";
import { hashPassword } from "./utils/hashPassword";

export class AuthService {
  static async createUser(body: registerInput): Promise<User> {
    try {
      // Check if user already exists
      const [findError, existingUser] = await UtilsService.to(
        User.findOne({
          where: { email: body.email },
        })
      );

      if (findError) {
        // Logger use karo for better debugging
        logger.error("Database error while finding user:", findError);
        UtilsService.throwError("Database error while finding user", 500);
      }

      if (existingUser) {
        UtilsService.throwError("User already exists with this email", 409);
      }

      // Hash password before creating user
      const hashedPassword = await hashPassword(body.password);

      // Create new user
      const [createError, user] = await UtilsService.to(
        User.create({
          name: body.name,
          email: body.email,
          passwordHash: hashedPassword,
          role: body.role || "BIDDER",
        })
      );

      if (createError ) {
        logger.error("Database error while creating user:", createError);
        UtilsService.throwError("Database error while creating user", 500);
      }
      if (!user) {
        UtilsService.throwError("User creation failed", 500);
      }
      
      return user;
      
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error("Unexpected error in createUser:", error);
      UtilsService.throwError("Internal server error", 500);
    }
  }
}