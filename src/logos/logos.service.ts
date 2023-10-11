import { Injectable } from '@nestjs/common';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';

@Injectable()
export class LogosService {
  create(createLogoDto: CreateLogoDto) {
    return 'This action adds a new logo';
  }

  findAll() {
    return `This action returns all logos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logo`;
  }

  update(id: number, updateLogoDto: UpdateLogoDto) {
    return `This action updates a #${id} logo`;
  }

  remove(id: number) {
    return `This action removes a #${id} logo`;
  }
}
