import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeederService } from './seeder.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Seeder')
@Controller('seeder')
@UseGuards(JwtAuthGuard)
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed database with initial data' })
  @ApiResponse({
    status: 200,
    description: 'Database seeded successfully',
    schema: { example: { message: 'Database seeded successfully!' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async seed() {
    await this.seederService.seed();
    return { message: 'Database seeded successfully!' };
  }
}
