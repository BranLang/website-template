import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryType, Language } from '../../entities/category.entity';
import { CategoryTranslation } from '../../entities/category-translation.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private categoryTranslationRepository: Repository<CategoryTranslation>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(language: Language = Language.SK, siteId: number = 1) {
    const cats = await this.categoryRepository.find({ where: { siteId }, relations: ['products', 'translations'], order: { sortOrder: 'ASC' } });
    return cats.map(c => {
      const tr = c.translations?.find(t => t.languageCode === language) || c.translations?.[0];
      return {
        id: c.id,
        name: tr?.name || '',
        slug: tr?.slug || '',
        description: tr?.description || null,
        type: c.type,
        imageUrl: c.imageUrl,
        sortOrder: c.sortOrder,
        isActive: c.isActive,
        parentId: c.parentId,
      };
    });
  }

  async findActive(language: Language = Language.SK, siteId: number = 1) {
    const cats = await this.categoryRepository.find({ where: { isActive: true, siteId }, relations: ['products', 'translations'], order: { sortOrder: 'ASC' } });
    return cats.map(c => {
      const tr = c.translations?.find(t => t.languageCode === language) || c.translations?.[0];
      return {
        id: c.id,
        name: tr?.name || '',
        slug: tr?.slug || '',
        description: tr?.description || null,
        type: c.type,
        imageUrl: c.imageUrl,
        sortOrder: c.sortOrder,
        isActive: c.isActive,
        parentId: c.parentId,
      };
    });
  }

  async findOne(id: number, language: Language = Language.SK, siteId: number = 1) {
    const c = await this.categoryRepository.findOne({ where: { id, siteId }, relations: ['products', 'translations'] });
    if (!c) return null;
    const tr = c.translations?.find(t => t.languageCode === language) || c.translations?.[0];
    return {
      id: c.id,
      name: tr?.name || '',
      slug: tr?.slug || '',
      description: tr?.description || null,
      type: c.type,
      imageUrl: c.imageUrl,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
      parentId: c.parentId,
      products: c.products,
    };
  }

  async findBySlug(slug: string, language: Language = Language.SK, siteId: number = 1) {
    const c = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'products')
      .leftJoinAndSelect('category.translations', 'ct')
      .where('category.siteId = :siteId', { siteId })
      .andWhere('ct.slug = :slug', { slug })
      .getOne();
    if (!c) return null;
    const tr = c.translations?.find(t => t.languageCode === language) || c.translations?.[0];
    return {
      id: c.id,
      name: tr?.name || '',
      slug: tr?.slug || '',
      description: tr?.description || null,
      type: c.type,
      imageUrl: c.imageUrl,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
      parentId: c.parentId,
      products: c.products,
    };
  }

  async findByType(type: CategoryType, language: Language = Language.SK, siteId: number = 1) {
    const cats = await this.categoryRepository.find({ where: { type, isActive: true, siteId }, relations: ['products', 'translations'], order: { sortOrder: 'ASC' } });
    return cats.map(c => {
      const tr = c.translations?.find(t => t.languageCode === language) || c.translations?.[0];
      return {
        id: c.id,
        name: tr?.name || '',
        slug: tr?.slug || '',
        description: tr?.description || null,
        type: c.type,
        imageUrl: c.imageUrl,
        sortOrder: c.sortOrder,
        isActive: c.isActive,
        parentId: c.parentId,
      };
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
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.categoryRepository.remove(category);
  }
}
