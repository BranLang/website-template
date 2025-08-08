import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nString } from '../../entities/i18n-string.entity';

@Injectable()
export class I18nService {
  constructor(
    @InjectRepository(I18nString)
    private i18nRepo: Repository<I18nString>,
  ) {}

  async getTranslations(language: string, namespaces: string[] = [], siteId?: number): Promise<Record<string, any>> {
    const where: any = { languageCode: language };
    if (siteId) where.siteId = siteId;
    const rows = await this.i18nRepo.find({ where });
    const result: Record<string, any> = {};
    for (const row of rows) {
      if (namespaces.length && row.namespace && !namespaces.includes(row.namespace)) continue;
      this.setByPath(result, row.key, row.value);
    }
    return result;
  }

  private setByPath(obj: any, path: string, value: any) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!cur[p]) cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
  }
}


