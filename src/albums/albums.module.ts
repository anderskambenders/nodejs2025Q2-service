import { Module } from '@nestjs/common';
import AlbumsController from './albums.controller';
import AlbumsService from './albums.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [PrismaModule, AuthModule],
})
export class AlbumsModule {}
