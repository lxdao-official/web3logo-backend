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

import * as ExcelJS from 'exceljs';

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

    const ishad = await this.prismaService.logoNames.findUnique({
      where: { logoName },
    });
    if (ishad) {
      const result = await this.prismaService.logoNames.update({
        where: { logoName },
        data: {
          logo: { create: saveFile },
        },
        include: {
          logo: true,
        },
      });
      return result;
    } else {
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
          // take: 20,
          orderBy: {
            id: 'desc',
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
          logoName: {
            update: {
              logoType: item.logoType,
            },
          },
        },
        include: {
          logoName: true,
        },
      }),
    );
    return await this.prismaService.$transaction(updateTask);
  }

  async uploadImgByCode(imgUrl: any[]) {
    const info = imgUrl.map(
      (i) =>
        ({
          logoName: i.name,
          logoType: '',
          website: '',
          files: [
            {
              fileName: i.name,
              fileType: i.type,
              file: i.url,
            },
          ],
          authorAddress: '0x257c21206df8a751dE09B3502B32d25888099DB9',
        } as unknown as CreateLogoDto),
    );
    await this.batchUploadFile(info);
  }

  async findAllLogs() {
    return this.prismaService.logos.findMany({ orderBy: { id: 'asc' } });
  }
  async batchUpdateFile(dtos: { id: number; file: string }[]) {
    const transaction = dtos.map((dto) => {
      const updatedAt = new Date().toISOString();
      return this.prismaService.logos.update({
        where: { id: dto.id },
        data: {
          file: dto.file,
        },
      });
    });
    await this.prismaService.$transaction(transaction);
  }

  async findLogoToExcel() {
    const data = await this.prismaService.logos.findMany({
      // where: {
      //   id: {
      //     gt: 948,
      //   },
      // },
      orderBy: {
        id: 'asc',
      },
      include: {
        logoName: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.addRow([
      'logo name',
      'logo project',
      'file name',
      'file link',
      'Address',
      'file type',
      'status',
    ]);
    data
      // .filter((i) => i.fileName.length < 20)
      .forEach((b) => {
        worksheet.addRow([
          b.logoName?.logoName,
          b.logoName?.logoType,
          b.fileName,
          b.file,
          b.authorAddress,
          b.fileType,
          b.status,
        ]);
      });
    const excelFilePath = 'example.xlsx';
    workbook.xlsx
      .writeFile(excelFilePath)
      .then(() => {
        console.log(`Excel file "${excelFilePath}" has been created.`);
      })
      .catch((error) => {
        console.error('Error creating Excel file:', error);
      });

    return data;
  }
}
