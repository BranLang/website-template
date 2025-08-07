import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { Page } from '../../entities/page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  providers: [PagesService],
  controllers: [PagesController],
  exports: [PagesService],
})
export class PagesModule {}
