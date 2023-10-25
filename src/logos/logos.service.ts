import { Favorite } from './../favorites/entities/favorite.entity';
import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindLogoNameQuery, PageSize } from './dto/find-logo.dto';
import { Prisma } from '@prisma/client';
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
        logo: { create: saveFile },
      },
      include: {
        logo: true,
      },
    });
    return result;
  }

  async findLogoName(query: FindLogoNameQuery) {
    const { page, size, key } = query;
    const skip = page * size;
    const where: Prisma.LogoNamesWhereInput = {};
    if (key) {
      where.logoName = {
        contains: key,
        mode: 'insensitive',
      };
    }
    const total = await this.prismaService.logoNames.count({ where });
    const result = await this.prismaService.logoNames.findMany({
      where,
      skip,
      take: +query.size,
      include: {
        logo: {
          where: { status: 'checked' },
        },
      },
    });

    return { data: result, page, size, total };
  }

  async findLogoNameById(id: number, address: string) {
    const result = await this.prismaService.logoNames.findUnique({
      where: {
        id,
      },
      include: {
        logo: true,
      },
    });
    if (address) {
      const userFavorite = await this.prismaService.favorites.findMany({
        where: { address },
      });
      const userFavoriteLogoId = userFavorite.map((logo) => logo.logoId);
      result.logo = result.logo.map((logo) => {
        const isFavorite = userFavoriteLogoId.includes(logo.id);
        const favoriteId = userFavorite.find((i) => i.logoId === logo.id)?.id;
        return {
          ...logo,
          favoriteId,
          isFavorite,
        };
      });
    }
    return result;
  }

  async findLogoByLogoNameId(logoNameId: number) {
    const result = await this.prismaService.logos.findMany({
      where: {
        logoNameId,
      },
    });
    return result;
  }

  async cancelFavorite(id: number) {
    await this.prismaService.favorites.delete({
      where: {
        id,
      },
    });
    return 'success';
  }

  async findLogoById(logoId: number) {
    const logo = await this.prismaService.logos.findFirst({
      where: { id: logoId },
      include: {
        logoName: true,
      },
    });

    return logo;
  }

  async findOwnLogos(address: string) {
    return await this.prismaService.logos.findMany({
      where: {
        authorAddress: address,
      },
      include: {
        logoName: true,
      },
    });
  }

  async downloadNumUpdate(id: number) {
    await this.prismaService.logos.update({
      where: { id },
      data: { downloadNum: { increment: 1 } },
    });
  }
}
