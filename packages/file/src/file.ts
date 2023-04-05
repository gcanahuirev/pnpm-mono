import { Upload } from '@aws-sdk/lib-storage/dist-types/Upload';
import { PassThrough, Readable } from 'stream';

export type SdkStream = Readable | ReadableStream | Blob | undefined;
export type StreamDuplex = {
  streamPassThrough: PassThrough;
  uploaded: Upload;
};
export type File = { key: string; filename: string };
export type FileStream = { stream: Readable; filename: string };
export type ISignedUrl = {
  expiresIn?: number;
  ResponseContentDisposition?: string;
};
