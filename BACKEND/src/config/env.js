const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().url("Invalid MongoDB URI"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  GOOGLE_GENAI_API_KEY: z.string().min(1, "GOOGLE_GENAI_API_KEY is required"),
  FRONTEND_URL: z.string().url("Invalid FRONTEND_URL").default("http://localhost:5173"),
  SMTP_HOST: z.string().default("smtp.ethereal.email"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.enum(["true", "false"]).default("false"),
  SMTP_USER: z.string().default("user@example.com"),
  SMTP_PASS: z.string().default("password"),
  SMTP_FROM: z.string().default("noreply@ytgenai.com"),
});

const env = envSchema.parse(process.env);

module.exports = env;
