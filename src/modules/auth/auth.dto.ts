import { UserResponseDTO } from "./auth.types";

export class UserDTO {
  static toResponse(user: any): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}