import { Injectable } from '@nestjs/common';

import { DEFAULT_CONFIG, searchQueue } from './config.default';
import {
  AuthConfig,
  ConfigData,
  DatabaseConfig,
  RabbitmqConfig,
  S3ClientConfig,
} from './config.interface';

@Injectable()
export class ConfigService {
  private config: ConfigData;
  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: parseInt(env.NODE_PORT!, 10) || DEFAULT_CONFIG.port,
      logLevel: env.NODE_LOG_LEVEL || DEFAULT_CONFIG.logLevel,
      auth: this.parseAuthenticationConfig(env, DEFAULT_CONFIG.auth),
      db: this.parseDatabaseConfig(env, DEFAULT_CONFIG.db),
      s3: this.parseS3ClientConfig(env, DEFAULT_CONFIG.s3),
      rmq: this.parseRabbitMQConfig(env, DEFAULT_CONFIG.rmq),
    };
  }

  private parseAuthenticationConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<AuthConfig>,
  ): AuthConfig {
    return {
      expiresIn: parseInt(env.JWT_EXPIRES_IN!, 10) || defaultConfig.expiresIn,
      accessTokenSecret:
        env.JWT_ACCESS_TOKEN || defaultConfig.accessTokenSecret,
      refreshTokenSecret:
        env.JWT_REFRESH_TOKEN || defaultConfig.refreshTokenSecret,
    };
  }

  private parseDatabaseConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<DatabaseConfig>,
  ): DatabaseConfig {
    return {
      host: env.DATABASE_HOST || defaultConfig.host,
      port: parseInt(env.DATABASE_PORT!, 10) || defaultConfig.port,
      username: env.DATABASE_USERNAME || defaultConfig.username,
      password: env.DATABASE_PASSWORD || defaultConfig.password,
      database: env.DATABASE_NAME || defaultConfig.database,
    };
  }

  private parseS3ClientConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<S3ClientConfig>,
  ): S3ClientConfig {
    return {
      accessKey: env.AWS_S3_ACCESS_KEY || defaultConfig.accessKey,
      secretAccessKey:
        env.AWS_S3_SECRET_ACCESS_KEY || defaultConfig.secretAccessKey,
      region: env.AWS_S3_REGION || defaultConfig.region,
      bucket: env.AWS_S3_BUCKET || defaultConfig.bucket,
    };
  }

  private parseRabbitMQConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<RabbitmqConfig>,
  ): RabbitmqConfig {
    return {
      host: env.RABBIT_MQ_HOST || defaultConfig.host,
      port: parseInt(env.RABBIT_MQ_PORT!, 10) || defaultConfig.port,
      username: env.RABBIT_MQ_USERNAME || defaultConfig.username,
      password: env.RABBIT_MQ_PASSWORD || defaultConfig.password,
      // Rmq queue value with dynamic key
      queue: searchQueue(process.env) || defaultConfig.queue,
    };
  }
}
