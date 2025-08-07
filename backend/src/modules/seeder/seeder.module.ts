import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { ImageDownloaderService } from './image-downloader.service';
import { Site } from '../../entities/site.entity';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { Page } from '../../entities/page.entity';
import { ProductImage } from '../../entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Site, Category, Product, Page, ProductImage])],
  providers: [SeederService, ImageDownloaderService],
  controllers: [SeederController],
})
export class SeederModule {}
