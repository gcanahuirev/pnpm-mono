import { Logger } from '@nestjs/common';
import { ConfigService } from '@pnpm-mono/config';
import Archiver = require('archiver');
import { Readable } from 'stream';

import { S3Service } from './s3.service';
import { FileStream, File } from './file';

const logger = new Logger();

/**
 * @description: Service to compress files
 * @version: 1.0.0
 * @package: @smartcore/file
 */

export class ZipService extends S3Service {
  constructor(readonly configService: ConfigService) {
    super(configService);
  }

  /**
   * @description: Compress files
   * @param files
   * @param keyZip
   * @returns {Promise<string>}
   */
  async compress(files: File[], keyZip: string): Promise<string> {
    const { streamPassThrough, uploaded } = this.writeStream(keyZip);
    const s3DownloadStreams = await this.#S3DownloadStreams(files);
    const zip = this.#archiver();

    await new Promise<string | void>((resolve, reject) => {
      streamPassThrough.on('close', (close: any) => {
        logger.debug('CLOSE PASSTHROUGH S3', close);
      });
      streamPassThrough.on('end', (end: any) => {
        logger.debug('END PASSTHROUGH S3', end);
      });
      streamPassThrough.on('error', reject);

      zip.pipe(streamPassThrough);
      s3DownloadStreams.forEach((streamDetails: FileStream) =>
        zip.append(streamDetails.stream, {
          name: streamDetails.filename,
        }),
      );
      zip
        .finalize()
        .then(() => {
          logger.debug('FINALIZE ZIP');
        })
        .catch((err: string) => {
          throw new Error(err);
        });
      uploaded
        .done()
        .then(() => {
          logger.debug('FINALIZE UPLOAD S3');
          resolve();
        })
        .catch((err: string) => {
          throw new Error(err);
        });
    }).catch((err: { code: string; message: string; data: string }) => {
      throw new Error(`${err.code} ${err.message} ${err.data}`);
    });

    logger.debug('RETURN KEYZIP', keyZip);
    return keyZip;
  }

  /**
   * @description: Download files and redirect to stream in S3
   * @param files
   * @returns {Promise<FileStream[]>}
   */
  async #S3DownloadStreams(files: File[]): Promise<FileStream[]> {
    const s3DownloadStreams: FileStream[] = [];
    await Promise.all(
      files.map(async (item) => {
        const { key, filename } = item;
        const stream = (await this.getObject(key)) as Readable;
        s3DownloadStreams.push({ stream, filename });
      }),
    );
    return s3DownloadStreams;
  }

  /**
   * @description: Create stream to write in S3
   * @returns {Archiver.Archiver}
   */
  #archiver(): Archiver.Archiver {
    const archive = Archiver('zip', {
      zlib: { level: 1 },
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        logger.warn(err.message, 'ARCHIVER');
      } else {
        logger.error(err.message, 'ARCHIVER');
      }
    });

    archive.on('error', (err) => {
      throw err;
    });
    return archive;
  }
}
