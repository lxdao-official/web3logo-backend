import { Favorite } from './../favorites/entities/favorite.entity';
import { Injectable, StreamableFile } from '@nestjs/common';
import {
  CreateLogoDto,
  FileObject,
  OnlyUploadFile,
} from './dto/create-logo.dto';
import { CheckLogoDto, UpdateLogoDto } from './dto/update-logo.dto';
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
      ...file,
      status: 'checking',
      authorAddress,
    }));
    const result = await this.prismaService.logoNames.create({
      data: {
        logoName,
        logoType,
        website,
        downloadTotalNum: 0,
        logo: { create: saveFile },
      },
      include: {
        logo: true,
      },
    });
    return result;
  }

  async onlyUploadFile(createLogoDto: OnlyUploadFile) {
    const result = await this.prismaService.logos.create({
      data: { ...createLogoDto, status: 'checking' },
    });
    return result;
  }

  async batchUploadFile(createLogoDto: CreateLogoDto[]) {
    const task = createLogoDto.map(async (i) => {
      const { files, logoName, logoType, website, authorAddress } = i;
      const saveFile = files.map((file) => ({
        ...file,
        status: 'checking',
        authorAddress,
      }));
      const findLogoName = await this.prismaService.logoNames.findFirst({
        where: {
          logoName,
          logoType,
        },
      });
      if (findLogoName) {
        return this.prismaService.logos.createMany({
          data: files.map((file) => ({
            ...file,
            logoNameId: findLogoName.id,
            status: 'checking',
            authorAddress,
          })),
        });
      } else {
        return this.prismaService.logoNames.create({
          data: {
            logoName,
            logoType,
            website,
            downloadTotalNum: 0,
            logo: { create: saveFile },
          },
          include: {
            logo: true,
          },
        });
      }
    });
    await Promise.all(task);
  }

  async findLogoName(query: FindLogoNameQuery) {
    const { page, size, key, logoType } = query;
    const skip = page * size;
    const where: Prisma.LogoNamesWhereInput = {};
    if (key) {
      where.logoName = {
        contains: key,
        mode: 'insensitive',
      };
    }
    if (logoType) {
      where.logoType = logoType;
    }
    const total = await this.prismaService.logoNames.count({ where });
    const result = await this.prismaService.logoNames.findMany({
      where,
      skip,
      take: +query.size,
      include: {
        logo: {
          where: { status: 'active' },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    return {
      data: result.filter((item) => item.logo.length > 0),
      page,
      size,
      total,
    };
  }

  async findLogoNameById(id: number, address: string) {
    const result = await this.prismaService.logoNames.findUnique({
      where: {
        id,
      },
      include: {
        logo: {
          orderBy: {
            id: 'asc',
          },
          where: { status: 'active' },
        },
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
    const info = await this.prismaService.logos.findFirst({
      where: { id },
      include: { logoName: true },
    });
    this.prismaService.$transaction([
      this.prismaService.logos.update({
        where: { id },
        data: { downloadNum: { increment: 1 } },
      }),
      this.prismaService.logoNames.update({
        where: { id: info.logoNameId },
        data: { downloadTotalNum: { increment: 1 } },
      }),
    ]);
  }

  async getLogoByAddress(query: { address: string; type: string }) {
    let result = [];
    switch (query.type) {
      case 'upload':
        result = await this.prismaService.logos.findMany({
          where: {
            authorAddress: query.address,
          },
        });
        break;
      case 'favorite':
        result = await this.prismaService.favorites.findMany({
          where: {
            address: query.address,
          },
          include: {
            logo: true,
          },
        });
        break;
      case 'checking':
        result = await this.prismaService.logos.findMany({
          where: {
            status: 'checking',
          },
          include: {
            logoName: true,
          },
        });
        break;
    }
    return result || [];
  }

  async checkLogo(logoIdList: CheckLogoDto[]) {
    const updateTask = logoIdList.map((item) =>
      this.prismaService.logos.update({
        where: {
          id: item.id,
        },
        data: {
          status: item.isAgree == true ? 'active' : 'reject',
        },
      }),
    );
    return await this.prismaService.$transaction(updateTask);
  }
}
