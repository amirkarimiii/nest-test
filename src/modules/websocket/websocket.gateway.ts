import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WebsocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log('================');
        console.log('CONNECTED');
        console.log('socket id:', client.id);
        console.log('================');
    }

    handleDisconnect(client: Socket) {
        console.log('================');
        console.log('DISCONNECTED');
        console.log('socket id:', client.id);
        console.log('================');
    }
}