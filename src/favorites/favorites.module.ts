import { Module } from '@nestjs/common';
import FavoritesService from './favorites.service';
import FavoritesController from './favorites.controller';
import TracksService from '../tracks/tracks.service';
import AlbumsService from '../albums/albums.service';
import ArtistsService from '../artists/artists.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, TracksService, AlbumsService, ArtistsService],
  imports: [PrismaModule, AuthModule],
})
export class FavoritesModule {}
