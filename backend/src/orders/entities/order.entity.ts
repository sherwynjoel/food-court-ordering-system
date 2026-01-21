import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    table_number: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    @Column()
    branch_id: string;

    @Column({ default: 'PENDING' }) // PENDING, PAID, COMPLETED
    status: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

