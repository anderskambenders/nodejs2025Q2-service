import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import TracksService from './tracks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  imports: [PrismaModule, AuthModule],
})
export class TracksModule {}
