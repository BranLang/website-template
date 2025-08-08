import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageType } from '../../entities/page.entity';
import { PageTranslation } from '../../entities/page-translation.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    @InjectRepository(PageTranslation)
    private pageTranslationRepository: Repository<PageTranslation>,
  ) {}

  create(createPageDto: CreatePageDto) {
    const page = this.pageRepository.create(createPageDto);
    return this.pageRepository.save(page);
  }

  async findAll(language: string = 'sk', siteId: number = 1) {
    const pages = await this.pageRepository.find({ where: { siteId }, relations: ['translations'], order: { sortOrder: 'ASC' } });
    return pages.map(p => this.mapPage(p, language));
  }

  async findPublished(language: string = 'sk', siteId: number = 1) {
    const pages = await this.pageRepository.find({ where: { isPublished: true, siteId }, relations: ['translations'], order: { sortOrder: 'ASC' } });
    return pages.map(p => this.mapPage(p, language));
  }

  async findOne(id: number, language: string = 'sk', siteId: number = 1) {
    const p = await this.pageRepository.findOne({ where: { id, siteId }, relations: ['translations'] });
    return p ? this.mapPage(p, language) : null;
  }

  async findBySlug(slug: string, language: string = 'sk', siteId: number = 1) {
    const p = await this.pageRepository
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.translations', 'pt')
      .where('page.siteId = :siteId', { siteId })
      .andWhere('pt.slug = :slug', { slug })
      .getOne();
    return p ? this.mapPage(p, language) : null;
  }

  async findByType(type: PageType, language: string = 'sk', siteId: number = 1) {
    const pages = await this.pageRepository.find({ where: { type, isPublished: true, siteId }, relations: ['translations'], order: { sortOrder: 'ASC' } });
    return pages.map(p => this.mapPage(p, language));
  }

  async update(id: number, updatePageDto: UpdatePageDto) {
    const page = await this.findOne(id);
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    const existing = await this.pageRepository.findOne({ where: { id }, relations: ['translations'] });
    Object.assign(existing!, updatePageDto);
    return this.pageRepository.save(existing!);
  }

  async remove(id: number) {
    const page = await this.pageRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return this.pageRepository.remove(page);
  }

  private mapPage(p: any, language: string) {
    const tr = p.translations?.find((t: any) => t.languageCode === language) || p.translations?.[0];
    return {
      id: p.id,
      title: tr?.title || '',
      slug: tr?.slug || '',
      content: tr?.content || '',
      excerpt: tr?.excerpt || null,
      type: p.type,
      featuredImageUrl: p.featuredImageUrl,
      isPublished: p.isPublished,
      sortOrder: p.sortOrder,
      metaDescription: tr?.metaDescription || null,
      metaKeywords: tr?.metaKeywords || null,
    };
  }
}
