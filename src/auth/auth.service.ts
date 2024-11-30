import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from 'src/app/interface/payload-token';

@Injectable()
export class AuthService {
  constructor(private readonly jwt_service: JwtService) {}
  createToken(payload_token: PayloadToken) {
    console.log(payload_token);
    return { token: this.jwt_service.sign(payload_token), status_code: 200 };
  }
}
