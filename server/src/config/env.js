const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGO_URI: z.string().min(1),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  ADMIN_API_KEY: z.string().min(12),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  REDIS_URL: z.string().optional(),
  INGEST_ON_START: z
    .string()
    .optional()
    .transform((value) => {
      if (value === undefined) return true;
      return value.toLowerCase() === 'true';
    }),
  INGEST_BATCH_SIZE: z.coerce.number().int().positive().max(100).default(30),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(8000)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = Object.freeze(parsed.data);
