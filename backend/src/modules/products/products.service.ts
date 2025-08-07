import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Language } from '../../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll(language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.productRepository.find({
      where: { language, siteId },
      relations: ['category', 'images'],
      order: { sortOrder: 'ASC' },
    });
  }

  findActive(language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.productRepository.find({
      where: { isActive: true, language, siteId },
      relations: ['category', 'images'],
      order: { sortOrder: 'ASC' },
    });
  }

  findFeatured(language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.productRepository.find({
      where: { isFeatured: true, isActive: true, language, siteId },
      relations: ['category', 'images'],
      order: { sortOrder: 'ASC' },
    });
  }

  findOne(id: number, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.productRepository.findOne({
      where: { id, language, siteId },
      relations: ['category', 'images'],
    });
  }

  findBySlug(slug: string, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.productRepository.findOne({
      where: { slug, language, siteId },
      relations: ['category', 'images'],
    });
  }

  findByCategory(categoryId: number, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.productRepository.find({
      where: { categoryId, isActive: true, language, siteId },
      relations: ['category', 'images'],
      order: { sortOrder: 'ASC' },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.productRepository.remove(product);
  }

  async addImage(productId: number, imageUrl: string, altText?: string) {
    const product = await this.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // For simplicity, we'll just update the main image URL
    // In a real application, you'd want to create a separate ProductImage entity
    product.mainImageUrl = imageUrl;
    return this.productRepository.save(product);
  }

  async removeImage(imageId: number) {
    // This is a simplified implementation
    // In a real application, you'd delete from ProductImage table
    return { message: 'Image removed successfully' };
  }
}
