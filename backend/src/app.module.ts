import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BranchesModule } from './branches/branches.module';
import { KitchensModule } from './kitchens/kitchens.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables (dev only)
      }),
      inject: [ConfigService],
    }),
    BranchesModule,
    KitchensModule,
    UsersModule,
    OrdersModule,
    MenuItemsModule,
    EventsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
