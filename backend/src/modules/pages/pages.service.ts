import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageType, Language } from '../../entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  create(createPageDto: CreatePageDto) {
    const page = this.pageRepository.create(createPageDto);
    return this.pageRepository.save(page);
  }

  findAll(language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.pageRepository.find({
      where: { language, siteId },
      order: { sortOrder: 'ASC' },
    });
  }

  findPublished(language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.pageRepository.find({
      where: { isPublished: true, language, siteId },
      order: { sortOrder: 'ASC' },
    });
  }

  findOne(id: number, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.pageRepository.findOne({
      where: { id, language, siteId },
    });
  }

  findBySlug(slug: string, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.pageRepository.findOne({
      where: { slug, isPublished: true, language, siteId },
    });
  }

  findByType(type: PageType, language: Language = Language.SK, siteId: string = 'just-eurookna') {
    return this.pageRepository.find({
      where: { type, isPublished: true, language, siteId },
      order: { sortOrder: 'ASC' },
    });
  }

  async update(id: number, updatePageDto: UpdatePageDto) {
    const page = await this.findOne(id);
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    Object.assign(page, updatePageDto);
    return this.pageRepository.save(page);
  }

  async remove(id: number) {
    const page = await this.findOne(id);
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return this.pageRepository.remove(page);
  }
}
