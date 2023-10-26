import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class FileObject {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string', default: '' })
  file: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string', default: '' })
  fileName: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string', default: '' })
  fileType: string;
}

export class OnlyUploadFile extends FileObject {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string', default: '' })
  logoNameId: number;
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string', default: '' })
  authorAddress: string;
}

export class CreateLogoDto {
  @ApiProperty({ required: true, type: 'string', default: 'Ethernum' })
  @IsString()
  @IsNotEmpty()
  logoName: string;

  @ApiProperty({ required: true, type: 'string', default: 'ETH' })
  @IsString()
  @IsNotEmpty()
  logoType: string;

  @ApiProperty({
    required: false,
    type: 'string',
    default: 'https://baidu.com',
  })
  website?: string;

  @ApiProperty({
    required: true,
    type: [FileObject],
    default: [{ file: '', fileName: '', fileType: '' }],
  })
  @IsArray()
  @IsNotEmpty()
  files: FileObject[];

  @ApiProperty({
    required: true,
    type: 'string',
    default: '0x2A604464B47ea72c29983b2bc56C2F87d5323065',
  })
  @IsString()
  @IsNotEmpty()
  authorAddress: string;
}
