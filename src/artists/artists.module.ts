import { Module } from '@nestjs/common';
import ArtistsController from './artists.controller';
import ArtistsService from './artists.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
  imports: [PrismaModule, AuthModule],
})
export class ArtistsModule {}
