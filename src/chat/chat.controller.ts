import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UserAuth } from 'src/app/decorator/user-auth.decorator';
import { PayloadToken } from 'src/app/interface/payload-token';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  create(
    @UserAuth() payload_token: PayloadToken,
    @Body() createChatDto: CreateChatDto,
  ) {
    return this.chatService.create(payload_token, createChatDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }
}
