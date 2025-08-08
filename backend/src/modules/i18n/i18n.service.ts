import { Injectable } from '@nestjs/common';

@Injectable()
export class I18nService {
  // TODO: Persist i18n strings in DB (I18nString entity). For now, return empty map.
  async getTranslations(language: string, namespaces: string[] = [], siteId?: number): Promise<Record<string, any>> {
    return {};
  }
}


