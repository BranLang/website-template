import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new page' })
  @ApiBody({ type: CreatePageDto })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published pages' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({ status: 200, description: 'List of published pages' })
  findAll(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.pagesService.findPublished(language, parseInt(siteId));
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all pages (admin)' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({ status: 200, description: 'List of all pages for admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllAdmin(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.pagesService.findAll(language, parseInt(siteId));
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get pages by type' })
  @ApiParam({ name: 'type', enum: PageType, description: 'Page type' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({ status: 200, description: 'List of pages of a specific type' })
  findByType(
    @Param('type') type: PageType,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.pagesService.findByType(type, language, parseInt(siteId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single page by ID' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({ status: 200, description: 'Page details' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  findOne(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.pagesService.findOne(+id, language, parseInt(siteId));
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a single page by slug' })
  @ApiParam({ name: 'slug', description: 'Page slug' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  @ApiResponse({ status: 200, description: 'Page details' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.pagesService.findBySlug(slug, language, parseInt(siteId));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a page' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiBody({ type: UpdatePageDto })
  @ApiResponse({ status: 200, description: 'Page updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(+id, updatePageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a page' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({ status: 200, description: 'Page deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  remove(@Param('id') id: string) {
    return this.pagesService.remove(+id);
  }
}
