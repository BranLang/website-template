import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Language } from '../../entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findAll(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.productsService.findActive(language, siteId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findAllAdmin(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.productsService.findAll(language, siteId);
  }

  @Get('featured')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findFeatured(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.productsService.findFeatured(language, siteId);
  }

  @Get('category/:id')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findByCategory(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.productsService.findByCategory(+id, language, siteId);
  }

  @Get(':id')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findOne(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.productsService.findOne(+id, language, siteId);
  }

  @Get('slug/:slug')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = 'just-eurookna'
  ) {
    return this.productsService.findBySlug(slug, language, siteId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/images')
  addImage(
    @Param('id') id: string,
    @Body() body: { imageUrl: string; altText?: string },
  ) {
    return this.productsService.addImage(+id, body.imageUrl, body.altText);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('images/:imageId')
  removeImage(@Param('imageId') imageId: string) {
    return this.productsService.removeImage(+imageId);
  }
}
