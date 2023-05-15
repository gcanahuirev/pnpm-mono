import { env } from 'process';
import { ConfigData } from './config.interface';

export const searchQueue = (
  env: NodeJS.ProcessEnv,
): {
  [key: string]: string | undefined;
} => {
  const regexQueue = new RegExp(/^(RABBIT_MQ)_[A-Z]+_(QUEUE)$/g);
  const queues = Object.keys(env).filter((key) => key.match(regexQueue));
  if (new Set(queues).size !== queues.length) {
    throw new Error('QUEUES DUPLICATED');
  }
  const envQueue: { [key: string]: string | undefined } = {};
  queues.forEach((envKey) => {
    const keyQueue = envKey.split('_')[2].toLocaleLowerCase();
    envQueue[keyQueue] = env[envKey];
  });
  return envQueue;
};

export const DEFAULT_CONFIG: ConfigData = {
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
    username: env.RABBIT_MQ_USERNAME,
    password: env.RABBIT_MQ_PASSWORD,
    ...searchQueue(env),
  },
};
