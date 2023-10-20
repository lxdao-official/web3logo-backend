import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  Query,
  Header,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { LogosService } from './logos.service';
import { CreateLogoDto } from './dto/create-logo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PageSize } from './dto/find-logo.dto';
import axios from 'axios';

@ApiTags('Logos')
@Controller('logos')
export class LogosController {
  private logger: Logger;
  constructor(private readonly logosService: LogosService) {}

  @Post()
  @ApiOperation({ summary: 'Create Logos', description: 'Create logos' })
  @ApiBody({ type: CreateLogoDto })
  async create(@Body() createLogoDto: CreateLogoDto) {
    return await this.logosService.create(createLogoDto);
  }

  @Get('/findLogoName')
  @ApiQuery({ name: 'page', type: Number, description: 'page' })
  @ApiQuery({ name: 'size', type: Number, description: 'size' })
  async findLogoName(@Query() query: PageSize) {
    return await this.logosService.findLogoName(query);
  }

  @Get('/findLogos/:logoNameId')
  @ApiParam({ name: 'logoNameId', type: 'number', description: 'logoNameId' })
  async findLogos(@Param('logoNameId') logoNameId: number) {
    return await this.logosService.findLogoByLogoNameId(+logoNameId);
  }

  @Get('/downloadLogo/:logoId')
  @ApiParam({ name: 'logoId', description: 'logoId' })
  async downloadLogo(@Param('logoId') logoId: number, @Res() res) {
    const logo = await this.logosService.findLogoById(+logoId);
    const response = await axios.get(logo.file, { responseType: 'stream' });
    const contentType = response.headers['content-type'];
    const imgType = contentType.split('/')[1];
    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${logo.logoName.logoName}.${imgType}"`,
    );
    response.data.pipe(res);
    await this.logosService.downloadNumUpdate(+logoId);
  }

  @Get('/findOwnLogos/:address')
  @ApiParam({ name: 'address', description: 'address' })
  async findOwnLogos(@Param('address') address: string) {
    return await this.logosService.findOwnLogos(address);
  }
}
