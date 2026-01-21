import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
  ) { }

  create(createMenuItemDto: CreateMenuItemDto) {
    const menuItem = this.menuItemsRepository.create(createMenuItemDto);
    return this.menuItemsRepository.save(menuItem);
  }

  findAll() {
    return this.menuItemsRepository.find({ relations: ['kitchen'] });
  }

  async findOne(id: string) {
    const menuItem = await this.menuItemsRepository.findOne({
      where: { id },
      relations: ['kitchen'],
    });
    if (!menuItem) {
      throw new NotFoundException(`MenuItem #${id} not found`);
    }
    return menuItem;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const menuItem = await this.findOne(id);
    this.menuItemsRepository.merge(menuItem, updateMenuItemDto);
    return this.menuItemsRepository.save(menuItem);
  }

  async remove(id: string) {
    const menuItem = await this.findOne(id);
    return this.menuItemsRepository.remove(menuItem);
  }
}
