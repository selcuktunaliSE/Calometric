import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(5000),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("30d"),
});

export const env = EnvSchema.parse(process.env);
