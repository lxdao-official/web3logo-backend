import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prismaService: PrismaService) {}

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

  async getOwnFavorite(address: string) {
    const result = await this.prismaService.favorites.findMany({
      where: {
        address,
      },
      include: {
        logo: true,
      },
    });
    return result;
  }

  async removeFavorite(id: number) {
    const result = await this.prismaService.favorites.delete({ where: { id } });
    await this.prismaService.logos.update({
      where: { id: result.logoId },
      data: { favoritesNum: { decrement: 1 } },
    });
  }
}
