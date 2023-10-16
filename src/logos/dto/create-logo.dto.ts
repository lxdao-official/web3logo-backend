import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

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
    type: 'string[]',
    default: [
      'https:/nftstorage.link/ipfs/bafkreiauxrwcagu2w3knv2l5t4ax45vom7t3ibsfqtgy7sima3aoucqzva',
      'https:/nftstorage.link/ipfs/bafkreiauxrwcagu2w3knv2l5t4ax45vom7t3ibsfqtgy7sima3aoucqzv2',
    ],
  })
  @IsArray()
  @IsNotEmpty()
  files: string[];

  @ApiProperty({
    required: true,
    type: 'string',
    default: '0x2A604464B47ea72c29983b2bc56C2F87d5323065',
  })
  @IsString()
  @IsNotEmpty()
  authorAddress: string;
}
