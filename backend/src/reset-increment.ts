
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    try {
        console.log('Resetting AUTO_INCREMENT for order table...');
        await dataSource.query('ALTER TABLE `order` AUTO_INCREMENT = 101');
        console.log('Successfully set AUTO_INCREMENT to 101.');
    } catch (error) {
        console.error('Error resetting AUTO_INCREMENT:', error);
    }

    await app.close();
}

bootstrap();
