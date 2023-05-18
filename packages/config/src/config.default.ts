import { env } from 'process';
import { ConfigData } from './config.interface';

export const DEFAULT_CONFIG = (): ConfigData => ({
  env: env.NODE_ENV ?? 'development',
  port: parseInt(env.NODE_PORT ?? '3000', 10),
  logLevel: env.NODE_LOG_LEVEL ?? 'debug',
  auth: {
    expiresIn: parseInt(env.JWT_EXPIRES_IN ?? '30000', 10),
    accessTokenSecret: env.JWT_ACCESS_TOKEN ?? 'sm_secret',
    refreshTokenSecret: env.JWT_REFRESH_TOKEN ?? 'sm_refresh_token',
  },
  s3: {
    accessKey: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    region: env.S3_REGION,
    bucket: env.S3_BUCKET,
  },
  db: {
    host: env.DATABASE_HOST ?? 'localhost',
    port: parseInt(env.DATABASE_PORT ?? '5432', 10),
    username: env.DATABASE_USERNAME ?? 'postgres',
    password: env.DATABASE_PASSWORD ?? 'postgres',
    database: env.DATABASE_NAME ?? 'postgres',
  },
  rmq: {
    host: env.RABBIT_MQ_HOST ?? 'localhost',
    port: parseInt(env.RABBIT_MQ_PORT ?? '5672', 10),
    username: env.RABBIT_MQ_USERNAME ?? 'guest',
    password: env.RABBIT_MQ_PASSWORD ?? 'guest',
  },
});
