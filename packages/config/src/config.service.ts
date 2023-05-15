import { Injectable } from '@nestjs/common';

import { DEFAULT_CONFIG } from './config.default';
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
    this.config = this.parseConfigFromEnv();
  }

  private parseConfigFromEnv(): ConfigData {
    return {
      env: DEFAULT_CONFIG.env,
      port: DEFAULT_CONFIG.port,
      logLevel: DEFAULT_CONFIG.logLevel,
      auth: this.parseAuthenticationConfig(DEFAULT_CONFIG.auth),
      db: this.parseDatabaseConfig(DEFAULT_CONFIG.db),
      s3: this.parseS3ClientConfig(DEFAULT_CONFIG.s3),
      rmq: this.parseRabbitMQConfig(DEFAULT_CONFIG.rmq),
    };
  }

  private parseAuthenticationConfig(
    defaultConfig: Readonly<AuthConfig>,
  ): AuthConfig {
    return {
      expiresIn: defaultConfig.expiresIn,
      accessTokenSecret: defaultConfig.accessTokenSecret,
      refreshTokenSecret: defaultConfig.refreshTokenSecret,
    };
  }

  private parseDatabaseConfig(
    defaultConfig: Readonly<DatabaseConfig>,
  ): DatabaseConfig {
    return {
      host: defaultConfig.host,
      port: defaultConfig.port,
      username: defaultConfig.username,
      password: defaultConfig.password,
      database: defaultConfig.database,
    };
  }

  private parseS3ClientConfig(
    defaultConfig: Readonly<S3ClientConfig>,
  ): S3ClientConfig {
    return {
      accessKey: defaultConfig.accessKey,
      secretAccessKey: defaultConfig.secretAccessKey,
      region: defaultConfig.region,
      bucket: defaultConfig.bucket,
    };
  }

  private parseRabbitMQConfig(
    defaultConfig: Readonly<RabbitmqConfig>,
  ): RabbitmqConfig {
    const { host, port, username, password, ...queues } = defaultConfig;
    return {
      host: defaultConfig.host,
      port: defaultConfig.port,
      username: defaultConfig.username,
      password: defaultConfig.password,
      // Rmq queue value with dynamic key
      ...queues,
    };
  }
}
