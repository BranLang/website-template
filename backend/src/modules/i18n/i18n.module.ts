import { Module } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { I18nController } from './i18n.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nString } from '../../entities/i18n-string.entity';

@Module({
  imports: [TypeOrmModule.forFeature([I18nString])],
  providers: [I18nService],
  controllers: [I18nController],
  exports: [I18nService],
})
export class I18nModule {}


