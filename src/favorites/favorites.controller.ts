import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('favorites')
@ApiTags('Favorite')
export class FavoritesController {
  private logger: Logger;
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('/saveFavorite')
  @ApiQuery({ name: 'logoId', description: 'feavorite logo', type: 'number' })
  @ApiQuery({ name: 'address', description: 'address', type: 'string' })
  async saveFavorite(
    @Query('logoId') logoId: number,
    @Query('address') address: string,
  ) {
    await this.favoritesService.saveFavorite(+logoId, address);
  }

  @Get('/getOwnFavorite/:address')
  @ApiParam({ name: 'address', description: 'address' })
  async getOwnFavorite(@Param('address') address: string) {
    return await this.favoritesService.getOwnFavorite(address);
  }

  @Delete('/removeFavorite/:id')
  async removeFavorite(@Param('id') id: string) {
    await this.favoritesService.removeFavorite(+id);
    return 'success';
  }
}
