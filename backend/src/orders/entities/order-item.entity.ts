import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
import { Kitchen } from '../../kitchens/entities/kitchen.entity';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => MenuItem)
    @JoinColumn({ name: 'menu_item_id' })
    menuItem: MenuItem;

    @Column()
    menu_item_id: string;

    @ManyToOne(() => Kitchen)
    @JoinColumn({ name: 'kitchen_id' })
    kitchen: Kitchen;

    @Column()
    kitchen_id: string;

    @Column({ default: 'PENDING' }) // PENDING, PREPARING, READY, SERVED
    status: string;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
