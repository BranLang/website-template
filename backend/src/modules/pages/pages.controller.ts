import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PageType, Language } from '../../entities/page.entity';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findAll(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.pagesService.findPublished(language, siteId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findAllAdmin(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.pagesService.findAll(language, siteId);
  }

  @Get('type/:type')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findByType(
    @Param('type') type: PageType,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.pagesService.findByType(type, language, siteId);
  }

  @Get(':id')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findOne(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.pagesService.findOne(+id, language, siteId);
  }

  @Get('slug/:slug')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.pagesService.findBySlug(slug, language, siteId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(+id, updatePageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(+id);
  }
}
