import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
    private eventsGateway: EventsGateway,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;

    // Fetch all menu items to get prices and kitchen IDs
    const menuItemIds = items.map((item) => item.menu_item_id);
    const menuItems = await this.menuItemsRepository.find({
      where: { id: In(menuItemIds) },
    });

    if (menuItems.length !== items.length) {
      throw new NotFoundException('Some menu items not found');
    }

    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItemsEntities: OrderItem[] = [];

    for (const itemDto of items) {
      const menuItem = menuItems.find((m) => m.id === itemDto.menu_item_id);
      if (!menuItem) continue;

      const price = menuItem.price * itemDto.quantity;
      totalAmount += price;

      const orderItem = this.orderItemsRepository.create({
        menu_item_id: menuItem.id,
        kitchen_id: menuItem.kitchen_id,
        quantity: itemDto.quantity,
        price: menuItem.price, // Store unit price
        status: 'PENDING',
      });
      orderItemsEntities.push(orderItem);
    }

    // Create and save the order
    const order = this.ordersRepository.create({
      ...orderData,
      total_amount: totalAmount,
      items: orderItemsEntities,
    });
    const savedOrder = await this.ordersRepository.save(order);

    // Emit events to kitchens
    for (const item of savedOrder.items) {
      this.eventsGateway.emitNewOrder(item.kitchen_id, item);
    }

    return savedOrder;
  }

  findAll() {
    return this.ordersRepository.find({ relations: ['items', 'items.menuItem'] });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.menuItem'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
