import { Module } from '@nestjs/common';
import { UploadImgService } from './upload-img.service';
import { UploadImgController } from './upload-img.controller';
import { LogosService } from 'src/logos/logos.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UploadImgController],
  providers: [UploadImgService, LogosService, PrismaService],
})
export class UploadImgModule {}
