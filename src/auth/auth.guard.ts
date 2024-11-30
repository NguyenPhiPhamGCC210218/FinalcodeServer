import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/app/decorator/public-api.decorator';
import { PayloadToken } from 'src/app/interface/payload-token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt_service: JwtService,
    private config_service: ConfigService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const is_public = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (is_public) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.exTrasTokenFromheader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload_token: PayloadToken = await this.jwt_service.verifyAsync(
        token,
        {
          secret: this.config_service.get('JWT_SECRET_KEY'),
        },
      );
      request['user'] = payload_token;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
  private exTrasTokenFromheader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type == 'Bearer' ? token : undefined;
  }
}
