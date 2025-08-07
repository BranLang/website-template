import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { Page } from '../../entities/page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Page])],
  providers: [SeederService],
  controllers: [SeederController],
})
export class SeederModule {}
