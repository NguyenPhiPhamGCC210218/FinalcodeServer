import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { PayloadToken } from 'src/app/interface/payload-token';
import { UserRole } from 'src/app/constant/user-role';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private usersRepository: Repository<Chat>,
  ) {}
  create(payload_token: PayloadToken, createChatDto: CreateChatDto) {
    const { content, to_user_id } = createChatDto;
    const new_chat = {
      sender: payload_token.id,
      receiver: to_user_id,
      content,
      date: new Date(),
    };
    console.log(new_chat);

    return this.usersRepository.save(new_chat);
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
