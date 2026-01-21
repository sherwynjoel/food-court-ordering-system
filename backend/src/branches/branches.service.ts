import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
  ) { }

  create(createBranchDto: CreateBranchDto) {
    const branch = this.branchesRepository.create(createBranchDto);
    return this.branchesRepository.save(branch);
  }

  findAll() {
    return this.branchesRepository.find();
  }

  async findOne(id: string) {
    const branch = await this.branchesRepository.findOneBy({ id });
    if (!branch) {
      throw new NotFoundException(`Branch #${id} not found`);
    }
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const branch = await this.findOne(id);
    this.branchesRepository.merge(branch, updateBranchDto);
    return this.branchesRepository.save(branch);
  }

  async remove(id: string) {
    const branch = await this.findOne(id);
    return this.branchesRepository.remove(branch);
  }
}
