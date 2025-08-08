import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/product-image.entity';
import { Category } from '../../entities/category.entity';
import { ProductTranslation } from '../../entities/product-translation.entity';
import { CategoryTranslation } from '../../entities/category-translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, Category, ProductTranslation, CategoryTranslation])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
