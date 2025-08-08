import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './api.service';

export type Language = 'sk' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('sk');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translateService: TranslateService, private api: ApiService) {
    // Load language from localStorage or default to Slovak
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'sk' || savedLanguage === 'en')) {
      this.setLanguage(savedLanguage);
    } else {
      this.setLanguage('sk');
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('language', language);
    // Load DB translations and merge, then switch language
    this.api.getI18n(language).subscribe(dbTranslations => {
      if (dbTranslations) {
        this.translateService.setTranslation(language, dbTranslations, true);
      }
      this.translateService.use(language);
    }, () => this.translateService.use(language));
  }

  toggleLanguage(): void {
    const current = this.getCurrentLanguage();
    const newLanguage: Language = current === 'sk' ? 'en' : 'sk';
    this.setLanguage(newLanguage);
  }
}
