import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for now
    },
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinKitchen')
    handleJoinKitchen(
        @MessageBody() kitchenId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`kitchen_${kitchenId}`);
        console.log(`Client ${client.id} joined kitchen_${kitchenId}`);
        return { event: 'joined', kitchenId };
    }

    // Method to be called by OrdersService
    emitNewOrder(kitchenId: string, orderItem: any) {
        this.server.to(`kitchen_${kitchenId}`).emit('newOrder', orderItem);
    }
}
