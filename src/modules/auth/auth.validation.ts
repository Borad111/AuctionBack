import { z } from "zod";
import { parseZodError } from "../../utils/zod.error";

export const registerSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(50, "Username must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "BIDDER", "SELLER"]).optional(),
});

export type registerInputDto = z.infer<typeof registerSchema>;

export function registerValidate(data: registerInputDto): { errorMsg?: string, success: boolean } {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    const errorMsg = parseZodError(result.error);
    return { errorMsg, success: false };
  }

  return { success: true };
}

export const loginSchema = z.object({
  idToken: z.string().min(1, "Authentication token is required"),
});

export type loginInputDto = z.infer<typeof loginSchema>;

export function loginValidate(data: loginInputDto): { errorMsg?: string, success: boolean } {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const errorMsg = parseZodError(result.error);
    return { errorMsg, success: false };
  }

  return { success: true };
}