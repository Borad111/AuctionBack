import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000").transform(Number),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FRONTEND_URL: z.string().url(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const env = envSchema.parse(process.env);

export default env;
