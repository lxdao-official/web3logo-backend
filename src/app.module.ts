import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { PrismaService } from './prisma/prisma.service';
import { LogosModule } from './logos/logos.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { UploadImgModule } from './upload-img/upload-img.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TestModule,
    LogosModule,
    UsersModule,
    FavoritesModule,
    UploadImgModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
