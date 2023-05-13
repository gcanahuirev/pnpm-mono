export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AuthConfig {
  expiresIn: number;
  accessTokenSecret: string;
  refreshTokenSecret: string;
}

export interface S3ClientConfig {
  accessKey: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

export interface RabbitmqConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface ConfigData {
  env: string;
  port: number;
  logLevel: string;
  auth: AuthConfig;
  db: DatabaseConfig;
  s3: S3ClientConfig;
  rmq: RabbitmqConfig;
}

