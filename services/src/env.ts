import dotenv from 'dotenv';
dotenv.config();

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`); return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DATABASE_URL: must('DATABASE_URL'),
  JWT_SECRET: must('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 120),
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '1 minute',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  WEBHOOK_SIGNING_SECRET: process.env.WEBHOOK_SIGNING_SECRET || 'dev',
  PROVIDERS: {
    LEGACY: { baseUrl: process.env.LEGACY_PROVIDER_URL, key: process.env.LEGACY_PROVIDER_KEY },
    MODERN: { baseUrl: process.env.MODERN_PROVIDER_URL, key: process.env.MODERN_PROVIDER_KEY }
  }
};
