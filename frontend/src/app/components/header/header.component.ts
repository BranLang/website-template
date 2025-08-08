import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { LanguageService } from '../../services/language.service';
import { SiteService } from '../../services/site.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonToggleModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentLanguage: string = 'sk';
  currentTheme: string = 'classic';
  themePreference: 'system' | 'light' | 'dark' = 'light';
  themes: any;
  isMobile: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor(private languageService: LanguageService, public siteService: SiteService, public auth: AuthService) {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    // load theme preference: system|light|dark (Material style)
    const savedPref = (localStorage.getItem('themePreference') as any) || 'system';
    this.themePreference = savedPref;
    this.currentTheme = this.resolveThemeFromPreference(savedPref);
    this.siteService.site$.subscribe(site => {
      this.themes = site?.settings?.themes;
    });
    this.siteService.setTheme(this.currentTheme);
    this.checkScreenSize();
    
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  onLanguageChange(language: string) {
    this.languageService.setLanguage(language as 'sk' | 'en');
    this.currentLanguage = language;
  }

  onThemeChange(theme: string) {
    this.currentTheme = theme;
    this.siteService.setTheme(theme);
  }

  onThemePreferenceChange(pref: 'system' | 'light' | 'dark') {
    this.themePreference = pref;
    localStorage.setItem('themePreference', pref);
    const theme = this.resolveThemeFromPreference(pref);
    this.onThemeChange(theme);
  }

  private resolveThemeFromPreference(pref: 'system' | 'light' | 'dark'): 'light' | 'dark' {
    if (pref === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return pref;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
