import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarouselController } from './carousel.controller';
import { CarouselService } from './carousel.service';
import { CarouselSlide } from '../../entities/carousel-slide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarouselSlide])],
  controllers: [CarouselController],
  providers: [CarouselService],
  exports: [CarouselService],
})
export class CarouselModule {}
