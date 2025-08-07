import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeederService } from './seeder.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Seeder')
@Controller('seeder')
@UseGuards(JwtAuthGuard)
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed database with initial data' })
  async seed() {
    await this.seederService.seed();
    return { message: 'Database seeded successfully!' };
  }
}
