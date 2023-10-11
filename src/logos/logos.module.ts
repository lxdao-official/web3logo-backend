import { Module } from '@nestjs/common';
import { LogosService } from './logos.service';
import { LogosController } from './logos.controller';

@Module({
  controllers: [LogosController],
  providers: [LogosService],
})
export class LogosModule {}
