import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { Page } from '../../entities/page.entity';
import { PageTranslation } from '../../entities/page-translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page, PageTranslation])],
  providers: [PagesService],
  controllers: [PagesController],
  exports: [PagesService],
})
export class PagesModule {}
