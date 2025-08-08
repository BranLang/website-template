import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  categories: any[] = [];
  carouselImages: string[] = [];
  currentSlideIndex = 0;
  private carouselTimer: any;
  aboutFeatures: string[] = [
    'HOME.ABOUT_FEATURES.0',
    'HOME.ABOUT_FEATURES.1',
    'HOME.ABOUT_FEATURES.2',
    'HOME.ABOUT_FEATURES.3'
  ];

  constructor(
    private apiService: ApiService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    public siteService: SiteService
  ) {
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.translateService.use(lang);
      this.loadData();
    });
  }

  ngOnInit() {
    this.siteService.site$.subscribe(site => {
      const imgs = (site?.settings?.images || []) as string[];
      // ensure unique and only valid strings
      this.carouselImages = Array.from(new Set(imgs.filter(Boolean)));
      if (this.carouselImages.length > 1) {
        clearInterval(this.carouselTimer);
        this.carouselTimer = setInterval(() => {
          this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselImages.length;
        }, 5000);
      }
    });
    this.loadData();
  }

  private loadData() {
    const currentLang = this.languageService.getCurrentLanguage();
    
    // Load featured products
    this.apiService.getFeaturedProducts(currentLang).subscribe(
      products => {
        // de-duplicate by slug
        const seen = new Set<string>();
        this.featuredProducts = products.filter(p => {
          const key = p.slug || p.id;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      },
      error => console.error('Error loading featured products:', error)
    );

    // Load categories
    this.apiService.getCategories(currentLang).subscribe(
      categories => this.categories = categories,
      error => console.error('Error loading categories:', error)
    );
  }
}
