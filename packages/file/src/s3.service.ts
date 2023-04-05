import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@pnpm-mono/config';
import { PassThrough } from 'stream';
import { SdkStream, StreamDuplex, ISignedUrl } from './file';

const logger = new Logger();

/**
 * @description: Service to upload files to S3
 * @version: 1.0.0
 * @package: @smartcore/file
 */

export class S3Service {
  constructor(protected readonly configService: ConfigService) {}

  private readonly s3 = new S3Client({
    region: this.configService.get().s3.region,
    credentials: {
      accessKeyId: this.configService.get().s3.accessKey,
      secretAccessKey: this.configService.get().s3.secretAccessKey,
    },
  });

  private readonly bucket = this.configService.get().s3.bucket;

  /**
   * @description: Upload file with multipart to S3
   * @param key
   * @param type
   * @param file
   * @returns {Promise<string>}
   */
  async upload(key: string, type: string, file: any): Promise<string> {
    try {
      const parallelUploads3 = new Upload({
        client: this.s3,
        leavePartsOnError: false,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: file,
          ContentType: type,
        },
      });

      parallelUploads3.on('httpUploadProgress', (progress) => {
        logger.debug(progress, 'AWS S3');
      });

      await parallelUploads3.done();
      return key;
    } catch (err: unknown) {
      if (err instanceof SyntaxError) logger.error(err.message, 'AWS S3');
      return err as string;
    }
  }

  /**
   * @description: Get presigned url to download file from S3
   * @param key
   * @param expiresIn
   * @returns {Promise<string>}
   */
  async getUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const input = {
        Bucket: this.bucket,
        Key: key,
      };
      const command = new GetObjectCommand(input);
      return getSignedUrl(this.s3, command, { expiresIn });
    } catch (err: unknown) {
      if (err instanceof SyntaxError) logger.error(err.message, 'AWS S3');
      return err as string;
    }
  }

  /**
   * @description: Get presigned url to download file from S3 with disposition
   * @param key
   * @param args: ISignedUrl = { expiresIn: 0 }
   * @returns {Promise<string>}
   */
  async getUrlDisposition(
    key: string,
    args: ISignedUrl = { expiresIn: 0 },
  ): Promise<string> {
    try {
      const input = {
        Bucket: this.bucket,
        Key: key,
        ResponseContentDisposition: `attachment; filename = "${args.ResponseContentDisposition}"`,
      };
      const command = new GetObjectCommand(input);
      return getSignedUrl(this.s3, command, { expiresIn: args.expiresIn });
    } catch (err: unknown) {
      if (err instanceof SyntaxError) logger.error(err.message, 'AWS S3');
      return err as string;
    }
  }

  /**
   * @description: Delete file from S3
   * @param key
   * @returns {Promise<boolean | undefined>}
   */
  async delete(key: string): Promise<boolean | undefined> {
    try {
      const input = {
        Bucket: this.bucket,
        Key: key,
      };
      const command = new DeleteObjectCommand(input);
      const { DeleteMarker } = await this.s3.send(command);
      return DeleteMarker;
    } catch (err: unknown) {
      if (err instanceof SyntaxError) logger.error(err.message, 'AWS S3');
      return err as boolean | undefined;
    }
  }

  /**
   * @description: Get file from S3
   * @param key
   * @returns {Promise<SdkStream>}
   */
  async getObject(key: string): Promise<SdkStream> {
    try {
      const input = {
        Bucket: this.bucket,
        Key: key,
      };

      const command = new GetObjectCommand(input);
      const { Body } = await this.s3.send(command);
      return Body as SdkStream;
    } catch (err: unknown) {
      if (err instanceof SyntaxError) logger.error(err.message, 'AWS S3');
      return err as SdkStream;
    }
  }

  /**
   * @description: Get upload eventemitter and passthrough streamduplex
   * @param key
   * @returns {Promise<StreamDuplex>}
   */
  protected writeStream(key: string): StreamDuplex {
    const streamPassThrough = new PassThrough();
    try {
      const uploaded = new Upload({
        client: this.s3,
        leavePartsOnError: false,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: streamPassThrough,
          ContentType: 'application/zip',
        },
      });

      uploaded.on('httpUploadProgress', (progress) => {
        logger.debug(progress, 'AWS S3');
      });

      return { streamPassThrough, uploaded };
    } catch (err: unknown) {
      if (err instanceof SyntaxError) logger.error(err.message, 'AWS S3');
      return err as StreamDuplex;
    }
  }
}
