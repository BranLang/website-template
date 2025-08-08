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

import { LanguageService } from '../../services/language.service';
import { SiteService } from '../../services/site.service';

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
    MatFormFieldModule
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="toolbar-content">
        <!-- Logo/Brand -->
        <div class="brand" *ngIf="siteService.site$ | async as site">
          <a routerLink="/" class="brand-link">
            <img *ngIf="site.logoUrl" [src]="siteService.resolveMediaUrl(site.logoUrl)" alt="{{site.name}}" class="brand-logo" />
            <span class="brand-text">{{ site.name }}</span>
          </a>
        </div>

        <!-- Navigation Menu -->
        <nav class="nav-menu" *ngIf="!isMobile">
          <a mat-button routerLink="/" routerLinkActive="active">
            {{ 'COMMON.HOME' | translate }}
          </a>
          <a mat-button routerLink="/about" routerLinkActive="active">
            {{ 'COMMON.ABOUT' | translate }}
          </a>
          
          <!-- Products Dropdown -->
          <button mat-button [matMenuTriggerFor]="productsMenu" class="nav-dropdown">
            {{ 'COMMON.PRODUCTS' | translate }}
            <mat-icon>expand_more</mat-icon>
          </button>
          <mat-menu #productsMenu="matMenu">
            <a mat-menu-item routerLink="/categories/window">
              {{ 'NAVIGATION.WINDOWS' | translate }}
            </a>
            <a mat-menu-item routerLink="/categories/door">
              {{ 'NAVIGATION.DOORS' | translate }}
            </a>
            <a mat-menu-item routerLink="/categories/accessory">
              {{ 'NAVIGATION.ACCESSORIES' | translate }}
            </a>
          </mat-menu>

          <a mat-button routerLink="/contact" routerLinkActive="active">
            {{ 'COMMON.CONTACT' | translate }}
          </a>
          <a mat-button routerLink="/faq" routerLinkActive="active">
            {{ 'COMMON.FAQ' | translate }}
          </a>
        </nav>

        <!-- Language Switcher -->
        <div class="language-switcher">
          <mat-form-field appearance="outline" class="language-select">
            <mat-label>{{ 'COMMON.LANGUAGE' | translate }}</mat-label>
            <mat-select
              [(ngModel)]="currentLanguage"
              (selectionChange)="onLanguageChange($event.value)">
              <mat-option value="sk">{{ 'COMMON.SLOVAK' | translate }}</mat-option>
              <mat-option value="en">{{ 'COMMON.ENGLISH' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          mat-icon-button 
          class="mobile-menu-button" 
          *ngIf="isMobile"
          (click)="toggleMobileMenu()">
          <mat-icon>{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <!-- Mobile Menu -->
    <div class="mobile-menu" *ngIf="isMobile && mobileMenuOpen">
      <a mat-button routerLink="/" (click)="closeMobileMenu()">
        {{ 'COMMON.HOME' | translate }}
      </a>
      <a mat-button routerLink="/about" (click)="closeMobileMenu()">
        {{ 'COMMON.ABOUT' | translate }}
      </a>
      <a mat-button routerLink="/categories/window" (click)="closeMobileMenu()">
        {{ 'NAVIGATION.WINDOWS' | translate }}
      </a>
      <a mat-button routerLink="/categories/door" (click)="closeMobileMenu()">
        {{ 'NAVIGATION.DOORS' | translate }}
      </a>
      <a mat-button routerLink="/categories/accessory" (click)="closeMobileMenu()">
        {{ 'NAVIGATION.ACCESSORIES' | translate }}
      </a>
      <a mat-button routerLink="/contact" (click)="closeMobileMenu()">
        {{ 'COMMON.CONTACT' | translate }}
      </a>
      <a mat-button routerLink="/faq" (click)="closeMobileMenu()">
        {{ 'COMMON.FAQ' | translate }}
      </a>
    </div>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .brand {
      display: flex;
      align-items: center;
    }

    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .brand-logo {
      height: 40px;
      margin-right: 8px;
    }

    .brand-text {
      margin-left: 8px;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-dropdown {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .language-switcher {
      display: flex;
      align-items: center;
    }

    .language-select {
      min-width: 120px;
    }

    .language-select ::ng-deep .mat-mdc-select-value {
      color: white;
    }

    .language-select ::ng-deep .mat-mdc-select-arrow {
      color: white;
    }

    .language-select ::ng-deep .mat-mdc-form-field-label {
      color: white;
    }

    .mobile-menu-button {
      display: none;
    }

    .mobile-menu {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 999;
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }

    .mobile-menu a {
      padding: 12px 16px;
      text-decoration: none;
      color: #333;
      border-bottom: 1px solid #eee;
    }

    .mobile-menu a:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }

      .mobile-menu-button {
        display: block;
      }

      .brand-text {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .toolbar-content {
        padding: 0 10px;
      }

      .language-select {
        min-width: 100px;
      }
    }
  `]
})
export class HeaderComponent {
  currentLanguage: string = 'sk';
  isMobile: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor(private languageService: LanguageService, public siteService: SiteService) {
    this.currentLanguage = this.languageService.getCurrentLanguage();
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

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
