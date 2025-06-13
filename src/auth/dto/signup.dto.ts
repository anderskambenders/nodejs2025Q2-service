import { IsDefined, IsNotEmpty } from 'class-validator';

class SignupDto {
  @IsDefined()
  @IsNotEmpty()
  login: string;
  @IsDefined()
  @IsNotEmpty()
  password: string;
}

export default SignupDto;
