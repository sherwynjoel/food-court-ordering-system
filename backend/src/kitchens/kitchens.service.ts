import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { UpdateKitchenDto } from './dto/update-kitchen.dto';
import { Kitchen } from './entities/kitchen.entity';

// Imports needed
import { Branch } from '../branches/entities/branch.entity';

@Injectable()
export class KitchensService {
  constructor(
    @InjectRepository(Kitchen)
    private kitchensRepository: Repository<Kitchen>,
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
  ) { }

  async create(createKitchenDto: CreateKitchenDto) {
    const branch = await this.branchesRepository.findOneBy({ id: createKitchenDto.branch_id });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${createKitchenDto.branch_id} not found`);
    }

    const kitchen = this.kitchensRepository.create({
      ...createKitchenDto,
      branch: branch,
    });
    return this.kitchensRepository.save(kitchen);
  }

  findAll() {
    return this.kitchensRepository.find({ relations: ['branch'] });
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
