import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { Site } from '../../entities/site.entity';
import { SiteImage } from '../../entities/site-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Site, SiteImage])],
  controllers: [SitesController],
  providers: [SitesService],
  exports: [SitesService],
})
export class SitesModule {}
