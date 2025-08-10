import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { of } from 'rxjs';
import { catchError, shareReplay, switchMap } from 'rxjs/operators';
import { Page } from '../../models/page.model';
import { Language } from '../../services/language.service';

@Injectable()
export class FaqService {
  faqPage$ = this.languageService.currentLanguage$.pipe(
    switchMap(lang => this.fetchFaqPage(lang)),
    shareReplay(1)
  );

  constructor(
    private api: ApiService,
    private languageService: LanguageService
  ) {}

  private fetchFaqPage(lang: Language) {
    return this.api.getPageBySlug('faq', lang).pipe(
      catchError(() => of(null))
    );
  }
}
