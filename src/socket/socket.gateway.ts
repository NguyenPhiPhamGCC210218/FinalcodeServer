import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PayloadToken } from '../app/interface/payload-token';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

export enum SocketEvent {
  CHAT = 'CHAT',
}
export type EmitEvent = {
  to_user_id: string;
  payload: object;
  type: SocketEvent;
};

class ShoppingSocket extends Socket {
  payload_token: PayloadToken;
}

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  public sockets: Map<string, Socket> = new Map();
  constructor(
    private readonly jwt_service: JwtService,
    private readonly chat_service: ChatService,
  ) {}
  afterInit(server: any) {
    console.log('Init socket');
  }
  handleConnection(client: ShoppingSocket, ...args: any[]) {
    const token =
      client.handshake.auth.token || client.handshake.headers.authorization;
    try {
      const payload_token: PayloadToken = this.jwt_service.verify(token);
      console.log(payload_token);

      if (payload_token) {
        Logger.debug('Socket connected: ' + client.id);
        client.payload_token = payload_token;
        this.sockets.set(payload_token.id.toString(), client);
      } else {
        throw new Error('Unauthorized');
      }
    } catch (e) {
      Logger.error('handleConnection: ' + e);
      client.emit('unauthorized', { message: 'unauthorized', status: 401 });
      client._cleanup();
      client.disconnect();
    }
  }

  handleDisconnect(client: ShoppingSocket) {
    client._cleanup();
    const payload_token: PayloadToken = client['payload_token'];
    this.sockets.delete(payload_token.username);
    Logger.debug('Socket disconnected: ' + client.id);
  }

  @SubscribeMessage(SocketEvent.CHAT)
  handleChatEvent(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: ShoppingSocket,
  ) {
    const { to_user_id, content } = data;
    console.log(data);

    this.chat_service.create(client.payload_token, data);
    const payload = {
      to_user_id: to_user_id.toString(),
      content,
      sender_id: client.payload_token.id,
      date: new Date(),
    };
    const emit_event: EmitEvent = {
      to_user_id: to_user_id.toString(),
      payload,
      type: SocketEvent.CHAT,
    };
    client.emit(SocketEvent.CHAT, payload);
    this.EmitEvent(emit_event);
  }

  EmitEvent(emit_event: EmitEvent) {
    const { to_user_id, payload, type } = emit_event;
    const socket: Socket = this.sockets.get(to_user_id);
    if (socket) {
      socket.emit(type, payload);
    }
  }
}
