import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sites')
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ 
    summary: 'Create a new site',
    description: 'Creates a new site with the provided details. Requires authentication.'
  })
  @ApiBody({ 
    type: CreateSiteDto,
    description: 'Site creation data',
    examples: {
      justEurookna: {
        summary: 'Just Eurookná Site Example',
        description: 'Example of creating the Just Eurookná site',
        value: {
          slug: 'just-eurookna',
          name: 'Just Eurookná',
          description: 'Slovenská výrobná spoločnosť zameraná na výrobu okien a dverí',
          domain: 'www.just-eurookna.sk',
          contactEmail: 'info@just-eurookna.sk',
          contactPhone: '0905 431 240',
          contactAddress: 'Viničná 609, 951 71 Sľažany, Slovensko',
          metaDescription: 'Just Eurookná - kvalitné okná a dvere',
          metaKeywords: 'okná, dvere, drevené, hliníkové, výroba'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Site created successfully',
    schema: {
      example: {
        id: 1,
        slug: 'just-eurookna',
        name: 'Just Eurookná',
        description: 'Slovenská výrobná spoločnosť zameraná na výrobu okien a dverí',
        isActive: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all active sites',
    description: 'Retrieves all active sites with their related data'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of active sites retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          slug: 'just-eurookna',
          name: 'Just Eurookná',
          description: 'Slovenská výrobná spoločnosť zameraná na výrobu okien a dverí',
          domain: 'www.just-eurookna.sk',
          isActive: true,
          categories: [],
          products: [],
          pages: []
        }
      ]
    }
  })
  findAll() {
    return this.sitesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get site by ID',
    description: 'Retrieves a specific site by its ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Site retrieved successfully'
  })
  @ApiResponse({ status: 404, description: 'Site not found' })
  findOne(@Param('id') id: string) {
    return this.sitesService.findOne(+id);
  }

  @Get('slug/:slug')
  @ApiOperation({ 
    summary: 'Get site by slug',
    description: 'Retrieves a specific site by its slug'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Site retrieved successfully'
  })
  @ApiResponse({ status: 404, description: 'Site not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.sitesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update site',
    description: 'Updates a site with the provided data. Requires authentication.'
  })
  @ApiResponse({ status: 200, description: 'Site updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.update(+id, updateSiteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete site',
    description: 'Soft deletes a site by setting isActive to false. Requires authentication.'
  })
  @ApiResponse({ status: 200, description: 'Site deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  remove(@Param('id') id: string) {
    return this.sitesService.remove(+id);
  }
}
