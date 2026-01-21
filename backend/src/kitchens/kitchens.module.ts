import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KitchensService } from './kitchens.service';
import { KitchensController } from './kitchens.controller';
import { Kitchen } from './entities/kitchen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kitchen])],
  controllers: [KitchensController],
  providers: [KitchensService],
})
export class KitchensModule { }
