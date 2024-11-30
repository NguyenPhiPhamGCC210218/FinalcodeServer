import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicAPI } from 'src/app/decorator/public-api.decorator';
import { PayloadToken } from 'src/app/interface/payload-token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('get-user-token')
  @PublicAPI()
  create(@Body() payload_token: PayloadToken) {
    return this.authService.createToken(payload_token);
  }
}
