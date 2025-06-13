import {
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import SignupDto from './dto/signup.dto';
import { compare, hash } from 'bcrypt';
import LoginDto from './dto/login.dto';
import { StatusCodes } from 'http-status-codes';
import RefreshDto from './dto/refresh.dto';

@Injectable()
class AuthService {
  constructor(
    private prismaDB: PrismaService,
    private jwt: JwtService,
  ) {}

  async registerUser(data: SignupDto) {
    const user = await this.prismaDB.user.findFirst({
      where: { login: data.login },
    });
    if (user)
      return Object.fromEntries(
        Object.entries(user).filter(([key]) => !['password'].includes(key)),
      );
    const salt = parseInt(process.env.CRYPT_SALT);
    const hashedPassword = await hash(data.password, salt);
    const result = await this.prismaDB.user.create({
      data: {
        login: data.login,
        password: hashedPassword,
      },
    });
    return Object.fromEntries(
      Object.entries(result).filter(([key]) => !['password'].includes(key)),
    );
  }

  async loginUser(data: LoginDto) {
    const user = await this.validateUser(data);
    if (!user)
      throw new HttpException('Payment required', StatusCodes.PAYMENT_REQUIRED);
    const payload = {
      userId: user.id,
      login: user.login,
    };
    return {
      userId: user.id,
      login: user.login,
      accessToken: this.jwt.sign(payload),
      refreshToken: this.jwt.sign(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }

  async refreshToken(refreshDto: RefreshDto) {
    if (!refreshDto.refreshToken)
      throw new UnauthorizedException('No refreshToken in request body');
    try {
      const refreshData = this.jwt.verify(refreshDto.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const user = await this.prismaDB.user.findUnique({
        where: { id: refreshData.userId },
      });

      if (!user) throw new Error();
      const payload = {
        userId: user.id,
        login: user.login,
      };
      return {
        userId: user.id,
        login: user.login,
        accessToken: this.jwt.sign(payload),
        refreshToken: this.jwt.sign(payload, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    } catch (error) {
      throw new ForbiddenException(
        'Authentication failed (Refresh token is invalid or expired)',
      );
    }
  }

  async validateUser(data: LoginDto) {
    const user = await this.prismaDB.user.findFirst({
      where: { login: data.login },
    });
    if (!user) return null;
    const passwordValid = await compare(data.password, user.password);
    return passwordValid && user ? user : null;
  }
}

export default AuthService;
