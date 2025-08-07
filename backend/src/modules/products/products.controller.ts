import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
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
  @ApiOperation({ 
    summary: 'Create a new product',
    description: 'Creates a new product with the provided details. Requires authentication.'
  })
  @ApiBody({ 
    type: CreateProductDto,
    description: 'Product creation data',
    examples: {
      woodenWindow: {
        summary: 'Wooden Window Example',
        description: 'Example of creating a wooden window product',
        value: {
          name: 'Drevené okno s dvojitým zasklením',
          slug: 'drevene-okno-dvojite-zasklenie',
          description: 'Kvalitné drevené okno s dvojitým zasklením a výbornou tepelnou izoláciou',
          specifications: 'Materiál: smrek, Zasklenie: dvojité, Tepelná izolácia: Uw = 1.1 W/m²K',
          material: 'wood',
          price: 450.00,
          categoryId: 1,
          siteId: 'just-eurookna',
          language: 'sk'
        }
      },
      aluminumDoor: {
        summary: 'Aluminum Door Example',
        description: 'Example of creating an aluminum door product',
        value: {
          name: 'Hliníkové vchodové dvere',
          slug: 'hlinikove-vchodove-dvere',
          description: 'Moderné hliníkové vchodové dvere s termoizoláciou',
          specifications: 'Materiál: hliník, Tepelná izolácia: Ud = 1.3 W/m²K',
          material: 'aluminum',
          price: 850.00,
          categoryId: 7,
          siteId: 'just-eurookna',
          language: 'sk'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Drevené okno s dvojitým zasklením',
        slug: 'drevene-okno-dvojite-zasklenie',
        description: 'Kvalitné drevené okno s dvojitým zasklením a výbornou tepelnou izoláciou',
        price: 450.00,
        material: 'wood',
        isActive: true,
        isFeatured: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all active products',
    description: 'Retrieves all active products filtered by language and site ID'
  })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter (default: sk)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter (default: 1)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of active products retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          name: 'Drevené okno s dvojitým zasklením',
          slug: 'drevene-okno-dvojite-zasklenie',
          description: 'Kvalitné drevené okno s dvojitým zasklením a výbornou tepelnou izoláciou',
          price: 450.00,
          material: 'wood',
          isActive: true,
          isFeatured: true,
          category: {
            id: 1,
            name: 'Drevené okná',
            slug: 'drevene-okna'
          },
          images: [
            {
              id: 1,
              imageUrl: '/uploads/products/product-1.jpg',
              altText: 'Drevené okno - obrázok 1'
            }
          ]
        }
      ]
    }
  })
  findAll(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: number = 1
  ) {
    return this.productsService.findActive(language, siteId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findAllAdmin(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: number = 1
  ) {
    return this.productsService.findAll(language, siteId);
  }

  @Get('featured')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findFeatured(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: number = 1
  ) {
    return this.productsService.findFeatured(language, siteId);
  }

  @Get('category/:id')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findByCategory(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: number = 1
  ) {
    return this.productsService.findByCategory(+id, language, siteId);
  }

  @Get(':id')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findOne(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: number = 1
  ) {
    return this.productsService.findOne(+id, language, siteId);
  }

  @Get('slug/:slug')
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: number = 1
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
