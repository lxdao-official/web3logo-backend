import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLogoDto } from './create-logo.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateLogoDto extends PartialType(CreateLogoDto) {}

export class CheckLogoDto {
  @IsNotEmpty()
  @ApiProperty({ name: 'id', type: Number, example: 1, required: true })
  id: number;

  @IsNotEmpty()
  @ApiProperty({
    name: 'isAgree',
    type: Boolean,
    example: true,
    required: true,
  })
  isAgree: boolean;

  @IsNotEmpty()
  @ApiProperty({
    name: 'logoType',
    type: String,
    example: 'NFTs',
    required: true,
  })
  logoType: string;
}
