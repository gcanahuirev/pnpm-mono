import { Injectable } from '@nestjs/common';

import { DEFAULT_CONFIG } from './config.default';
import { ConfigData, ConfigDatabase } from './config.interface';

@Injectable()
export class ConfigService {
  private config: ConfigData;
  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: parseInt(env.NODE_PORT!, 10) || DEFAULT_CONFIG.port,
      logLevel: env.NODE_LOG_LEVEL || DEFAULT_CONFIG.logLevel,
      auth: {
        expiresIn: Number(env.JWT_TOKEN_EXPIRY),
        accessTokenSecret: env.JWT_ACCESS_TOKEN ?? '',
        refreshTokenSecret: env.JWT_REFRESH_TOKEN ?? '',
      },
      s3: {
        accessKey: env?.AWS_S3_ACCESS_KEY ?? '',
        secretAccessKey: env?.AWS_S3_SECRET_ACCESS_KEY ?? '',
        region: env?.AWS_S3_REGION ?? '',
        bucket: env?.AWS_S3_BUCKET ?? '',
      },
      db: this.parseDBConfig(env, DEFAULT_CONFIG.db),
    };
  }

  private parseDBConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ConfigDatabase>,
  ): ConfigDatabase {
    return {
      host: env.DATABASE_HOST || defaultConfig.host,
      port: parseInt(env.DATABASE_PORT!, 10) || defaultConfig.port,
      username: env.DATABASE_USERNAME || defaultConfig.username,
      password: env.DATABASE_PASSWORD || defaultConfig.password,
      database: env.DATABASE_NAME || defaultConfig.database,
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
