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
  accessKey: string | undefined;
  secretAccessKey: string | undefined;
  region: string | undefined;
  bucket: string | undefined;
}

export interface RabbitmqConfig {
  host: string | undefined;
  port: number | undefined;
  username: string | undefined;
  password: string | undefined;
  [key: string]: string | number | undefined;
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

