import Track from '../../tracks/dto/tracks.dto';
import IAlbum from '../../albums/types/album.interface';
import IArtist from '../../artists/types/artists.interface';

class FavoriteResponseDto {
  artists: IArtist[] = [];
  albums: IAlbum[] = [];
  tracks: Track[] = [];
}

export default FavoriteResponseDto;
