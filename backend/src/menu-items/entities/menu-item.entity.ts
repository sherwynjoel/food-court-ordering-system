import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Kitchen } from '../../kitchens/entities/kitchen.entity';

@Entity()
export class MenuItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    image_url: string;

    @ManyToOne(() => Kitchen, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'kitchen_id' })
    kitchen: Kitchen;

    @Column()
    kitchen_id: string;

    @Column()
    branch_id: string;
}

