import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoryType, Language } from '../../entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findAll(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.categoriesService.findActive(language, siteId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findAllAdmin(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.categoriesService.findAll(language, siteId);
  }

  @Get('type/:type')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findByType(
    @Param('type') type: CategoryType,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.categoriesService.findByType(type, language, siteId);
  }

  @Get(':id')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findOne(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.categoriesService.findOne(+id, language, siteId);
  }

  @Get('slug/:slug')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.categoriesService.findBySlug(slug, language, siteId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
