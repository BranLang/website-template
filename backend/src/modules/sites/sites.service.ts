import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../../entities/site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}

  create(createSiteDto: CreateSiteDto) {
    const site = this.siteRepository.create(createSiteDto);
    return this.siteRepository.save(site);
  }

  findAll() {
    return this.siteRepository.find({
      where: { isActive: true },
      relations: ['categories', 'products', 'pages'],
    });
  }

  findOne(id: number) {
    return this.siteRepository.findOne({
      where: { id },
      relations: ['categories', 'products', 'pages'],
    });
  }

  findBySlug(slug: string) {
    return this.siteRepository.findOne({
      where: { slug, isActive: true },
      relations: ['categories', 'products', 'pages'],
    });
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return this.siteRepository.update(id, updateSiteDto);
  }

  remove(id: number) {
    return this.siteRepository.update(id, { isActive: false });
  }
}
