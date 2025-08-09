import { APP_INITIALIZER, Provider } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { catchError, of } from 'rxjs';

export function appInitializerFactory(translate: TranslateService, langService: LanguageService): () => Promise<any> {
  return () => new Promise((resolve) => {
    const defaultLang = langService.getCurrentLanguage();
    translate.setDefaultLang(defaultLang);
    translate.use(defaultLang).pipe(
      catchError(() => of(null))
    ).subscribe({
      complete: () => resolve(null)
    });
  });
}

export const AppInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: appInitializerFactory,
  deps: [TranslateService, LanguageService],
  multi: true,
};
