import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoryType, Language } from '../../entities/category.entity';

const categoryExample = {
  id: 1,
  name: 'Windows',
  slug: 'windows',
  description: 'All window products',
  type: CategoryType.WINDOW,
  imageUrl: 'https://example.com/window.jpg',
  sortOrder: 1,
  isActive: true,
  siteId: 1,
  language: Language.SK,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  products: [],
};

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Category creation data',
    examples: {
      default: {
        summary: 'Category example',
        value: {
          name: 'Windows',
          slug: 'windows',
          description: 'All window products',
          type: CategoryType.WINDOW,
          imageUrl: 'https://example.com/window.jpg',
          sortOrder: 1,
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: { example: categoryExample },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({
    status: 200,
    description: 'List of active categories',
    schema: { example: [categoryExample] },
  })
  findAll(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.categoriesService.findActive(language, parseInt(siteId));
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all categories (admin)' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({
    status: 200,
    description: 'List of all categories for admin',
    schema: { example: [categoryExample] },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllAdmin(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.categoriesService.findAll(language, parseInt(siteId));
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get categories by type' })
  @ApiParam({ name: 'type', enum: CategoryType, description: 'Category type' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({
    status: 200,
    description: 'List of categories of a specific type',
    schema: { example: [categoryExample] },
  })
  findByType(
    @Param('type') type: CategoryType,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.categoriesService.findByType(type, language, parseInt(siteId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({
    status: 200,
    description: 'Category details',
    schema: { example: categoryExample },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.categoriesService.findOne(+id, language, parseInt(siteId));
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a single category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({
    status: 200,
    description: 'Category details',
    schema: { example: categoryExample },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.categoriesService.findBySlug(slug, language, parseInt(siteId));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Category update data',
    examples: {
      default: {
        summary: 'Update category example',
        value: {
          name: 'Updated Windows',
          isActive: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    schema: { example: categoryExample },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    schema: { example: categoryExample },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
