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

  constructor(private translateService: TranslateService) {
    const savedLanguage = localStorage.getItem('language') as Language;
    this.setLanguage(savedLanguage || 'sk');
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('language', language);
    this.translateService.use(language);
  }

  toggleLanguage(): void {
    const newLanguage: Language = this.getCurrentLanguage() === 'sk' ? 'en' : 'sk';
    this.setLanguage(newLanguage);
  }
}
