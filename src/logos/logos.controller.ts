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
import { PageSize, FindLogos } from './dto/find-logo.dto';
import { Response } from 'express';
import { createReadStream, createWriteStream } from 'fs';
import { request } from 'request';
import axios from 'axios';
import * as path from 'path';
import { log } from 'console';

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

  @Get('/saveFavorite')
  @ApiQuery({ name: 'logoId', description: 'feavorite logo', type: 'number' })
  @ApiQuery({ name: 'address', description: 'address', type: 'string' })
  async saveFavorite(
    @Query('logoId') logoId: number,
    @Query('address') address: string,
  ) {
    return await this.logosService.saveFavorite(+logoId, address);
  }

  @Get('/downloadLogo/:logoId')
  @ApiParam({ name: 'logoId', description: 'logoId' })
  async downloadLogo(@Param('logoId') logoId: number, @Res() res) {
    const logo = await this.logosService.findLogoById(+logoId);
    console.log('logo', logo);
    const response = await axios.get(logo.file, { responseType: 'stream' });
    const contentType = response.headers['content-type'];
    const imgType = contentType.split('/')[1];
    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${logo.logoNames.logoName}.${imgType}"`,
    );
    response.data.pipe(res);

    // try {
    //   const logo = await this.logosService.findLogoById(+logoId);
    //   res.setHeader('Content-Disposition', `attachment; filename="image.png"`);
    //   res.setHeader('Content-Type', 'image/png');
    //   const response = await axios.get(logo.file, { responseType: 'stream' });
    //   console.log('response', response);
    //   if (response.status === 200) {
    //     const savePath = path.join(__dirname, 'logo.png');
    //     const stream = createWriteStream(savePath);
    //     response.data.pipe(stream);
    //     stream.on('finish', () => {
    //       stream.close();
    //       res.sendFile(savePath);
    //     });
    //     stream.on('error', () => {
    //       stream.close();
    //       res.status(500).send('download failed');
    //     });
    //   } else {
    //     throw new Error('Image address error, download failed');
    //   }
    // } catch (err) {
    //   throw new Error('Download failed');
    // }
  }
}
