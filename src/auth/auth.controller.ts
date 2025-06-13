import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import AuthService from './auth.service';
import SignupDto from './dto/signup.dto';
import LoginDto from './dto/login.dto';
import RefreshDto from './dto/refresh.dto';

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.registerUser(signupDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const payload = await this.authService.loginUser(loginDto);
    return payload;
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto);
  }
}

export default AuthController;
