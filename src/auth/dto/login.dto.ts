import { IsDefined, IsNotEmpty } from 'class-validator';

class LoginDto {
  @IsDefined()
  @IsNotEmpty()
  login: string;
  @IsDefined()
  @IsNotEmpty()
  password: string;
}

export default LoginDto;
