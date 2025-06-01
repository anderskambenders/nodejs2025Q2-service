import IAlbum from '../../albums/types/album.interface';
import IArtist from '../../artists/types/artists.interface';
import ITrack from '../../tracks/types/track.interface';

class FavoriteResponseDto {
  artists: IArtist[] = [];
  albums: IAlbum[] = [];
  tracks: ITrack[] = [];
}

export default FavoriteResponseDto;
