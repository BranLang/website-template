import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryType, Language } from '../../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll(language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.categoryRepository.find({
      where: { language, siteId },
      relations: ['products'],
      order: { sortOrder: 'ASC' },
    });
  }

  findActive(language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.categoryRepository.find({
      where: { isActive: true, language, siteId },
      relations: ['products'],
      order: { sortOrder: 'ASC' },
    });
  }

  findOne(id: number, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.categoryRepository.findOne({
      where: { id, language, siteId },
      relations: ['products'],
    });
  }

  findBySlug(slug: string, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.categoryRepository.findOne({
      where: { slug, language, siteId },
      relations: ['products'],
    });
  }

  findByType(type: CategoryType, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.categoryRepository.find({
      where: { type, isActive: true, language, siteId },
      relations: ['products'],
      order: { sortOrder: 'ASC' },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.categoryRepository.remove(category);
  }
}
