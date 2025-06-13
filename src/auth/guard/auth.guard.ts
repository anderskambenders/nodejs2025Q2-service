import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    try {
      const currPath = request.url.split('/')[1];
      if (['', 'auth', 'doc'].includes(currPath)) return true;
      const token = this.getToken(request);
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Authorization Header');
    }
  }

  private getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization =
      request.headers['authorization'] || request.headers['Authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error();
    }
    const [name, token] = authorization.split(' ');
    if (name !== 'Bearer') throw new Error();
    return token;
  }
}
