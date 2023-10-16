import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform/transform.interceptor';
import getLogLevels from './utils/getLogLevels';
import { HttpExceptionFilter } from './http-exception-filter/http-exception-filter.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  const config = new DocumentBuilder()
    .setTitle('Web3logo API')
    .setDescription('The Web3logo API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}
bootstrap();
