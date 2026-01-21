import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, MenuItem]), EventsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
