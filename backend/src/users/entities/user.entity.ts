import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    BRANCH_ADMIN = 'BRANCH_ADMIN',
    KITCHEN_STAFF = 'KITCHEN_STAFF',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Hide password by default
    password_hash: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.BRANCH_ADMIN,
    })
    role: UserRole;

    @Column({ nullable: true })
    branch_id: string; // Null for Super Admin

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

