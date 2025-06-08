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
} from '@nestjs/common';
import AlbumsService from './albums.service';
import CreateAlbumDto from './dto/create-album.dto';
import UpdateAlbumDto from './dto/update-album.dto';

@Controller('album')
class AlbumsController {
  constructor(private albumService: AlbumsService) {}

  @Get()
  async findAlbums() {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  async findAlbum(@Param('id', ParseUUIDPipe) id: string) {
    const album = await this.albumService.getAlbumById(id);
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    return album;
  }

  @Post()
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  async updateAlbum(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const album = await this.albumService.updateAlbum(id, updateAlbumDto);
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    return album;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.albumService.deleteAlbum(id);
  }
}

export default AlbumsController;
