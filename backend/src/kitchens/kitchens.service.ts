import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { UpdateKitchenDto } from './dto/update-kitchen.dto';
import { Kitchen } from './entities/kitchen.entity';

@Injectable()
export class KitchensService {
  constructor(
    @InjectRepository(Kitchen)
    private kitchensRepository: Repository<Kitchen>,
  ) { }

  create(createKitchenDto: CreateKitchenDto) {
    const kitchen = this.kitchensRepository.create(createKitchenDto);
    return this.kitchensRepository.save(kitchen);
  }

  findAll() {
    return this.kitchensRepository.find();
  }

  async findOne(id: string) {
    const kitchen = await this.kitchensRepository.findOneBy({ id });
    if (!kitchen) {
      throw new NotFoundException(`Kitchen #${id} not found`);
    }
    return kitchen;
  }

  async update(id: string, updateKitchenDto: UpdateKitchenDto) {
    const kitchen = await this.findOne(id);
    this.kitchensRepository.merge(kitchen, updateKitchenDto);
    return this.kitchensRepository.save(kitchen);
  }

  async remove(id: string) {
    const kitchen = await this.findOne(id);
    return this.kitchensRepository.remove(kitchen);
  }
}
