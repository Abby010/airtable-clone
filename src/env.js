import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),

    AUTH_TRUST_HOST: z.string().optional(),
    AUTH_URL: z.string().url().optional(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),

    DATABASE_URL: z.string().url(),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  client: {
    // Define public vars here if needed (e.g., NEXT_PUBLIC_API_URL)
  },

  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    AUTH_URL: process.env.AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
