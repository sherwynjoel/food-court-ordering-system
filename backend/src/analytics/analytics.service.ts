import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Kitchen } from '../kitchens/entities/kitchen.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Kitchen)
        private kitchensRepository: Repository<Kitchen>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async getDashboardStats() {
        const totalOrders = await this.ordersRepository.count();

        const revenueResult = await this.ordersRepository
            .createQueryBuilder('order')
            .select('SUM(order.total_amount)', 'total')
            .getRawOne();
        const totalRevenue = parseFloat(revenueResult.total) || 0;

        const activeKitchens = await this.kitchensRepository.count();
        const activeUsers = await this.usersRepository.count();

        return {
            totalOrders,
            totalRevenue,
            activeKitchens,
            activeUsers,
        };
    }
}
