import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserRole } from './users/entities/user.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';

    console.log('Checking if admin user exists...');
    const users = await usersService.findAll();
    const existingAdmin = users.find(u => u.email === adminEmail);

    if (!existingAdmin) {
        console.log('Creating admin user...');
        await usersService.create({
            email: adminEmail,
            password: adminPassword,
            role: UserRole.SUPER_ADMIN,
        } as CreateUserDto);
        console.log('Admin user created successfully.');
    } else {
        console.log('Admin user already exists.');
    }

    await app.close();
}

bootstrap();
