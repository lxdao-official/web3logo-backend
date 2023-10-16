import { Module } from '@nestjs/common';
import { LogosService } from './logos.service';
import { LogosController } from './logos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LogosController],
  providers: [LogosService, PrismaService],
})
export class LogosModule {}
