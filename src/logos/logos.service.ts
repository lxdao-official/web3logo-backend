import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PageSize } from './dto/find-logo.dto';

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
