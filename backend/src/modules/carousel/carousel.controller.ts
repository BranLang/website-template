import { Controller, Get, Param } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselSlide } from '../../entities/carousel-slide.entity';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get()
  async findAll(): Promise<CarouselSlide[]> {
    return this.carouselService.findAll();
  }

  @Get('site/:siteId')
  async findBySite(@Param('siteId') siteId: string): Promise<CarouselSlide[]> {
    return this.carouselService.findBySite(parseInt(siteId, 10));
  }
}
