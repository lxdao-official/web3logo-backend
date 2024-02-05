import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UploadImgService } from './upload-img.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload-img')
export class UploadImgController {
  constructor(private readonly uploadImgService: UploadImgService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      const fileUrl = await this.uploadImgService.uploadFile(files);
      return { data: fileUrl };
    } catch (err) {
      console.log(err);
    }
  }

  @Get('/downloadedFiles')
  async downloadImgs() {
    return await this.uploadImgService.downloadImgs();
  }
}
