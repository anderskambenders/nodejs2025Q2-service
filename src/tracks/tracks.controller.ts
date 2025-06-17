import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import TracksService from './tracks.service';
import Track from './dto/tracks.dto';
import CreateTrackDto from './dto/create-track.dto';
import UpdateTrackDto from './dto/update-track..dto';
import { JwtGuard } from 'src/auth/guard/auth.guard';

@UseGuards(JwtGuard)
@Controller('track')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Get()
  async findTracks() {
    return this.tracksService.getTracks();
  }

  @Get(':id')
  async findTrack(@Param('id', ParseUUIDPipe) id: string) {
    const track = await this.tracksService.getTrackById(id);
    if (track) return track;
    throw new NotFoundException(`Track with id ${id} not found`);
  }

  @Post()
  async createTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksService.createTrack(createTrackDto);
  }

  @Put(':id')
  async updateTrack(
    @Body() updateTrackDto: UpdateTrackDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Track> {
    const trackToUpdate = await this.tracksService.updateTrack(
      id,
      updateTrackDto,
    );
    if (trackToUpdate) return trackToUpdate;
    throw new NotFoundException(`Track with id ${id} not found`);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tracksService.deleteTrack(id);
  }
}

export default TracksController;
