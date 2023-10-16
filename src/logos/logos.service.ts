import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PageSize, FindLogos } from './dto/find-logo.dto';
import { createReadStream } from 'fs';
import { log } from 'console';

@Injectable()
export class LogosService {
  constructor(private prismaService: PrismaService) {}
  async create(createLogoDto: CreateLogoDto) {
    const { files, logoName, logoType, website, authorAddress } = createLogoDto;
    const saveFile = files.map((file) => ({
      file,
      status: 'checking',
      authorAddress,
    }));
    const result = await this.prismaService.logoNames.create({
      data: {
        logoName,
        logoType,
        website,
        logos: { create: saveFile },
      },
      include: {
        logos: true,
      },
    });
    return result;
  }

  async findLogoName(query: PageSize) {
    const { page, size } = query;
    const skip = page * size;
    const total = await this.prismaService.logoNames.count();
    const result = await this.prismaService.logoNames.findMany({
      skip,
      take: +query.size,
    });
    return { data: result, page, size, total };
  }

  async findLogoByLogoNameId(logoNameId: number) {
    const result = await this.prismaService.logos.findMany({
      where: {
        logoNameId,
      },
    });
    return result;
  }

  async saveFavorite(logoId: number, address: string) {
    const saveFavorite = this.prismaService.favorites.create({
      data: {
        logoId,
        address,
      },
    });
    const addFavoriteNum = this.prismaService.logos.update({
      where: { id: logoId },
      data: {
        favoritesNum: {
          increment: 1,
        },
      },
    });
    const transaction = await this.prismaService.$transaction([
      saveFavorite,
      addFavoriteNum,
    ]);

    return transaction;
  }

  async findLogoById(logoId: number) {
    const logo = await this.prismaService.logos.findFirst({
      where: { id: logoId },
      include: {
        logoNames: true,
      },
    });

    return logo;
  }
}
