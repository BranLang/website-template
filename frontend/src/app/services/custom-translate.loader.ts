import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Language } from './language.service';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private api: ApiService) {}

  getTranslation(lang: string): Observable<any> {
    return this.api.getI18n(lang as Language);
  }
}
