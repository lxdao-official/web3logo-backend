import { PartialType } from '@nestjs/swagger';
import { CreateUploadImgDto } from './create-upload-img.dto';

export class UpdateUploadImgDto extends PartialType(CreateUploadImgDto) {}
