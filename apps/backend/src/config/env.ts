import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';

// Charger les variables d'environnement
dotenvConfig();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  CORS_ORIGIN: z.string().optional(),
});

export const config = envSchema.parse(process.env);