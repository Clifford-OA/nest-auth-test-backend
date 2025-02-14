import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
  cors: ['http://localhost:3000'],
})
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  @WebSocketServer()
  private readonly server: Server;

  // onModuleInit() {
  //   this.server.on('connection', (socket) => {
  //     console.log({ connection: socket.handshake.auth.token });
  //     this.logger.log(socket.id, new Date());
  //   });
  // }

  private afterInit() {
    this.logger.log('after init function called.......................');
    this.server.use((socket, next) => {
      const { token } = socket.handshake.auth;

      let user: Record<string, string>;
      if (token) {
        user = { name: 'clifford', email: 'email', phoneNumber: '+233' };
      }

      if (!user) {
        console.log({ error: token });
        next(new UnauthorizedException()); //
        return;
      }
      socket.data.user = user;
      socket.join('users'); //join a room for segregation purposes
      console.log({ afterInit: token });
      next();

      // this.server.on('connection', (socket) => {
      //   console.log({ connection: socket.handshake.auth.token });
      //   this.logger.log(socket.id, new Date());
      // });
    });

    // this.server.on('connection', (socket) => {
    //   console.log({ connection: socket.handshake.auth.token });
    //   this.logger.log(socket.id, new Date());
    // });
  }

  @SubscribeMessage('firstMessage')
  onFirstMessage(@MessageBody() body: any) {
    return body;
  }

  @SubscribeMessage('secondMessage')
  onSecondMessage(@MessageBody() body: any) {
    this.logger.log('emitting', body);
    this.server.to('users').emit('firstEmitMessage', `${body} received`);
  }
}
