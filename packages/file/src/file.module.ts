import { Module } from '@nestjs/common';
import { ConfigModule } from '@pnpm-mono/config';
import { S3Service } from './s3.service';
import { ZipService } from './zip.service';
import { ExcelService } from './excel.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [S3Service, ExcelService, ZipService],
  exports: [S3Service, ExcelService, ZipService],
})
export class FileModule {}
