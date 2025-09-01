import { User } from "../../models/user.model";
import { UtilsService } from "../../utils/utils.service";
import { registerInputDto } from "./auth.validation";
import { AppError } from "../../utils/app.error";
import logger from "../../utils/logger";
import admin from "../../config/firebase";
import { JwtService } from "../../utils/jwt.service";

export class AuthService {
  static async createUser(body: registerInputDto): Promise<User> {
    try {
      // Check if user already exists by email
      const existingUserByEmail = await User.findOne({
        where: { email: body.email },
      });

      if (existingUserByEmail) {
        UtilsService.throwError("User already exists with this email", 409);
      }

      // Check if user already exists by ID
      const existingUserById = await User.findByPk(body.id);
      if (existingUserById) {
        UtilsService.throwError("User already exists", 409);
      }

      // Create new user
      const user = await User.create({
        id: body.id,
        name: body.name,
        email: body.email,
        role: body.role || "BIDDER",
      });

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

  static async verifyFirebaseToken(idToken: string): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Verify Firebase ID Token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const firebaseUid = decodedToken.uid;
      const email = decodedToken.email;

      if (!email) {
        throw new AppError("Email not found in token", 400);
      }

      // Check if email is verified
      // if (!decodedToken.email_verified) {
      //   throw new AppError("Please verify your email first", 403);
      // }

      // Find or create user in database
      let user = await this.findUserById(firebaseUid);

      if (!user) {
        user = await User.create({
          id: firebaseUid,
          email: email,
          name: decodedToken.name || email.split('@')[0],
          role: "BIDDER",
          emailVerifiedAt: new Date(),
        });
      }

      // Generate JWT tokens
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.generateAccessToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      // Handle Firebase specific errors
      if (error.code === 'auth/id-token-expired') {
        throw new AppError("Login session expired, please login again", 401);
      }
      if (error.code === 'auth/id-token-revoked') {
        throw new AppError("Login session revoked", 401);
      }
      if (error.code === 'auth/argument-error') {
        throw new AppError("Invalid authentication token", 401);
      }

      logger.error("Firebase token verification error:", error);
      throw new AppError("Authentication failed", 401);
    }
  }

  static async findUserById(id: string): Promise<User | null> {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      logger.error("Database error in findUserById:", error);
      throw new AppError("Database error", 500);
    }
  }

  static generateAccessToken(payload: object): string {
    return JwtService.generateAccessToken(payload);
  }

  static generateRefreshToken(payload: object): string {
    return JwtService.generateRefreshToken(payload);
  }

  static verifyRefreshToken(token: string): any {
    return JwtService.verifyRefreshToken(token);
  }
}