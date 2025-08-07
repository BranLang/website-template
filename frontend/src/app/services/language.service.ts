import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'sk' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('sk');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor() {
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
  }

  toggleLanguage(): void {
    const current = this.getCurrentLanguage();
    const newLanguage: Language = current === 'sk' ? 'en' : 'sk';
    this.setLanguage(newLanguage);
  }
}
