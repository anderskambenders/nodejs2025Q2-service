import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import TracksService from './tracks.service';
import CreateTrackDto from './dto/create-track.dto';
import ITrack from './types/track.interface';
import UpdateTrackDto from './dto/update-track..dto';

@Controller('track')
export class TracksController {
  constructor(private trackService: TracksService) {}

  @Get()
  async findTracks(): Promise<ITrack[]> {
    return this.trackService.getTracks();
  }

  @Get(':id')
  async findTrack(@Param('id', ParseUUIDPipe) id: string): Promise<ITrack> {
    return this.trackService.getTrackById(id);
  }

  @Post()
  async createTrack(@Body() createTrackDto: CreateTrackDto): Promise<ITrack> {
    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  async updateTrack(
    @Body() updateTrackDto: UpdateTrackDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ITrack> {
    return this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  async deleteTrack(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.trackService.deleteTrack(id);
  }
}

export default TracksController;
