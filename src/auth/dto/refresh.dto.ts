import { IsDefined, IsNotEmpty } from 'class-validator';

class RefreshDto {
  @IsDefined()
  @IsNotEmpty()
  refreshToken: string;
}
export default RefreshDto;
