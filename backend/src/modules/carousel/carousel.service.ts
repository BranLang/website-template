import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarouselSlide } from '../../entities/carousel-slide.entity';

@Injectable()
export class CarouselService {
  constructor(
    @InjectRepository(CarouselSlide)
    private carouselSlideRepository: Repository<CarouselSlide>,
  ) {}

  async findAll(): Promise<CarouselSlide[]> {
    return this.carouselSlideRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findBySite(siteId: number): Promise<CarouselSlide[]> {
    return this.carouselSlideRepository.find({
      where: { siteId, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async create(createCarouselSlideDto: Partial<CarouselSlide>): Promise<CarouselSlide> {
    const carouselSlide = this.carouselSlideRepository.create(createCarouselSlideDto);
    return this.carouselSlideRepository.save(carouselSlide);
  }

  async update(id: string, updateCarouselSlideDto: Partial<CarouselSlide>): Promise<CarouselSlide> {
    await this.carouselSlideRepository.update(id, updateCarouselSlideDto);
    return this.carouselSlideRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.carouselSlideRepository.delete(id);
  }
}
