import Artist from '../../artists/dto/artists.dto';
import Track from '../../tracks/dto/tracks.dto';
import IAlbum from '../../albums/dto/album.dto';

class FavoriteResponseDto {
  artists: Artist[] = [];
  albums: IAlbum[] = [];
  tracks: Track[] = [];
}

export default FavoriteResponseDto;
