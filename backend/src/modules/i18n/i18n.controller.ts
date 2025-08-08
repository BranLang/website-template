import { Controller, Get, Query } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18n: I18nService) {}

  @Get()
  async getTranslations(
    @Query('language') language: string,
    @Query('namespaces') namespacesCsv?: string,
    @Query('siteId') siteId?: string,
  ) {
    const namespaces = namespacesCsv ? namespacesCsv.split(',') : [];
    return this.i18n.getTranslations(language || 'sk', namespaces, siteId ? parseInt(siteId) : undefined);
  }
}


