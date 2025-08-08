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
    @Query('siteId') siteId: string = '1'
  ) {
    return this.productsService.findActive(language, parseInt(siteId));
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Get all products (admin)',
    description: 'Retrieves all products for administrative purposes, filtered by language and site ID. Requires authentication.'
  })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter (default: sk)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of all products for admin retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  findAllAdmin(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.productsService.findAll(language, parseInt(siteId));
  }

  @Get('featured')
  @ApiOperation({ 
    summary: 'Get featured products',
    description: 'Retrieves all featured products, filtered by language and site ID'
  })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter (default: sk)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of featured products retrieved successfully' })
  findFeatured(
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.productsService.findFeatured(language, parseInt(siteId));
  }

  @Get('category/:id')
  @ApiOperation({ 
    summary: 'Get products by category ID',
    description: 'Retrieves all active products for a given category ID, filtered by language and site ID'
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter (default: sk)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of products in the category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findByCategory(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.productsService.findByCategory(+id, language, parseInt(siteId));
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a single product by ID',
    description: 'Retrieves a single product by its ID, filtered by language and site ID'
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter (default: sk)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter (default: 1)' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(
    @Param('id') id: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.productsService.findOne(+id, language, parseInt(siteId));
  }

  @Get('slug/:slug')
  @ApiOperation({ 
    summary: 'Get a single product by slug',
    description: 'Retrieves a single product by its slug, filtered by language and site ID'
  })
  @ApiParam({ name: 'slug', description: 'Product slug' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Language filter (default: sk)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site ID filter (default: 1)' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('language') language: Language = Language.SK,
    @Query('siteId') siteId: string = '1'
  ) {
    return this.productsService.findBySlug(slug, language, parseInt(siteId));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a product',
    description: 'Updates an existing product with the provided details. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto, description: 'Product update data' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a product',
    description: 'Deletes a product by its ID. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/images')
  @ApiOperation({ 
    summary: 'Add an image to a product',
    description: 'Adds a new image to a product. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        imageUrl: { type: 'string' }, 
        altText: { type: 'string' } 
      } 
    } 
  })
  @ApiResponse({ status: 201, description: 'Image added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  addImage(
    @Param('id') id: string,
    @Body() body: { imageUrl: string; altText?: string },
  ) {
    return this.productsService.addImage(+id, body.imageUrl, body.altText);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('images/:imageId')
  @ApiOperation({ 
    summary: 'Remove an image from a product',
    description: 'Removes an image from a product by its ID. Requires authentication.'
  })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  removeImage(@Param('imageId') imageId: string) {
    return this.productsService.removeImage(+imageId);
  }
}
