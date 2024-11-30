import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat/entities/chat.entity';

@Module({
  imports: [ChatModule, AuthModule, TypeOrmModule.forFeature([Chat])],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
