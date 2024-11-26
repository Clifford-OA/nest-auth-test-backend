import { Logger, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketService implements OnModuleInit {
  private readonly logger = new Logger(SocketService.name);

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      this.logger.log(socket.id, new Date());
    });
  }

  @SubscribeMessage('firstMessage')
  onFirstMessage(@MessageBody() body: any) {
    return body;
  }

  @SubscribeMessage('secondMessage')
  onSecondMessage(@MessageBody() body: any) {
    this.server.emit('firstEmitMessage', body);
  }
}
