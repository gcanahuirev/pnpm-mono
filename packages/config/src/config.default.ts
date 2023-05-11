import { ConfigData } from './config.interface';


export const searchQueue = (env: NodeJS.ProcessEnv): string | undefined => {
  const regexQueue = new RegExp(/^(RABBIT_MQ)_[A-Z]+_(QUEUE)$/g);
  const queues = Object.keys(env).filter((key) => key.match(regexQueue))
  if (queues.length > 1) {
    throw new Error('Only one queue is allowed');
  }
  if (queues.length === 0) {
    return undefined;
  }
  return env[queues[0]];
};


export const DEFAULT_CONFIG: ConfigData = {
  env: process.env.NODE_ENV! || 'development',
  port: parseInt(process.env.NODE_PORT!, 10) || 3000,
  logLevel: process.env.NODE_LOG_LEVEL! || 'debug',
  auth: {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN!, 10) || 30000,
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN!,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN!,
  },
  s3: {
    accessKey: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    region: process.env.S3_REGION!,
    bucket: process.env.S3_BUCKET!,
  },
  db: {
    host: process.env.DATABASE_HOST! || 'localhost',
    port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
    username: process.env.DATABASE_USERNAME! || 'postgres',
    password: process.env.DATABASE_PASSWORD! || 'postgres',
    database: process.env.DATABASE_NAME! || 'postgres',
  },
  rmq: {
    host: process.env.RABBIT_MQ_HOST!,
    port: parseInt(process.env.RABBIT_MQ_PORT!, 10) || 5672,
    username: process.env.RABBIT_MQ_USERNAME!,
    password: process.env.RABBIT_MQ_PASSWORD!,
    queue: searchQueue(process.env)!,
  },
};
