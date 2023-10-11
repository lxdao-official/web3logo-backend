import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LogosService } from './logos.service';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Logos')
@Controller('logos')
export class LogosController {
  constructor(private readonly logosService: LogosService) {}

  @Post()
  create(@Body() createLogoDto: CreateLogoDto) {
    return this.logosService.create(createLogoDto);
  }

  @Get()
  findAll() {
    return this.logosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogoDto: UpdateLogoDto) {
    return this.logosService.update(+id, updateLogoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logosService.remove(+id);
  }
}
