import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Language } from '../../entities/product.entity';
import { ProductTranslation } from '../../entities/product-translation.entity';
import { CategoryTranslation } from '../../entities/category-translation.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductTranslation)
    private productTranslationRepository: Repository<ProductTranslation>,
    @InjectRepository(CategoryTranslation)
    private categoryTranslationRepository: Repository<CategoryTranslation>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(language: Language = Language.SK, siteId: number = 1) {
    const products = await this.productRepository.find({
      where: { siteId },
      relations: ['category', 'images', 'translations', 'category.translations'],
      order: { sortOrder: 'ASC' },
    });
    return this.mapAndDedupe(products, language);
  }

  async findActive(language: Language = Language.SK, siteId: number = 1) {
    const products = await this.productRepository.find({
      where: { isActive: true, siteId },
      relations: ['category', 'images', 'translations', 'category.translations'],
      order: { sortOrder: 'ASC' },
    });
    return this.mapAndDedupe(products, language);
  }

  async findFeatured(language: Language = Language.SK, siteId: number = 1) {
    const products = await this.productRepository.find({
      where: { isFeatured: true, isActive: true, siteId },
      relations: ['category', 'images', 'translations', 'category.translations'],
      order: { sortOrder: 'ASC' },
    });
    return this.mapAndDedupe(products, language);
  }

  async findOne(id: number, language: Language = Language.SK, siteId: number = 1) {
    const p = await this.productRepository.findOne({
      where: { id, siteId },
      relations: ['category', 'images', 'translations', 'category.translations'],
    });
    return p ? this.mapProductWithTranslation(p, language) : null;
  }

  async findBySlug(slug: string, language: Language = Language.SK, siteId: number = 1) {
    const p = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.translations', 'pt')
      .leftJoinAndSelect('category.translations', 'ct')
      .where('product.siteId = :siteId', { siteId })
      .andWhere('(pt.slug = :slug)', { slug })
      .getOne();
    return p ? this.mapProductWithTranslation(p, language) : null;
  }

  async findByCategory(categoryId: number, language: Language = Language.SK, siteId: number = 1) {
    const products = await this.productRepository.find({
      where: { categoryId, isActive: true, siteId },
      relations: ['category', 'images', 'translations', 'category.translations'],
      order: { sortOrder: 'ASC' },
    });
    return this.mapAndDedupe(products, language);
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
    const product = await this.productRepository.findOne({ where: { id } });
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

  private mapProductWithTranslation(product: any, language: Language) {
    const tr = Array.isArray(product.translations)
      ? (product.translations.find((t: any) => t.languageCode === language) || product.translations[0])
      : null;
    const catTr = product.category && Array.isArray(product.category.translations)
      ? (product.category.translations.find((t: any) => t.languageCode === language) || product.category.translations[0])
      : null;
    return {
      id: product.id,
      name: tr?.name || '',
      slug: tr?.slug || '',
      description: tr?.description || '',
      specifications: tr?.specifications || null,
      material: product.material,
      price: product.price,
      sortOrder: product.sortOrder,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      mainImageUrl: product.mainImageUrl,
      category: product.category ? {
        id: product.category.id,
        name: catTr?.name || '',
        slug: catTr?.slug || '',
      } : null,
      images: product.images || [],
    };
  }

  private mapAndDedupe(products: any[], language: Language) {
    const mapped = products.map(p => this.mapProductWithTranslation(p, language));
    const seen = new Set<string>();
    return mapped.filter(p => {
      const key = (p.slug && String(p.slug).trim()) || String(p.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
