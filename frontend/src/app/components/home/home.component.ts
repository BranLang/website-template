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
  groupedCategories: { window: any[]; door: any[]; realization: any[] } = { window: [], door: [], realization: [] };
  groupImages: { window?: string; door?: string; realization?: string } = {};
  private categoryImagesMap: Record<string, string> = {};
  private cacheBuster = Date.now();
  private siteImages: string[] = [];
  carouselImages: string[] = [];
  currentSlideIndex = 0;
  private carouselTimer: any;
  pageTitle = '';
  pageSubtitle = '';
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
      this.siteImages = imgs.map(u => this.siteService.resolveMediaUrl(u));
      // ensure unique and only valid strings
      this.carouselImages = Array.from(new Set(imgs.filter(Boolean)));
      if (this.carouselImages.length > 1) {
        clearInterval(this.carouselTimer);
        this.carouselTimer = setInterval(() => {
          this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselImages.length;
        }, 5000);
      }
      const categoryImages = site?.settings?.categoryImages || {};
      this.categoryImagesMap = categoryImages as Record<string, string>;
      // Recompute once mapping is available and categories may have been loaded
      this.computeGroupImages();
    });
    this.loadData();
  }

  private loadData() {
    const currentLang = this.languageService.getCurrentLanguage();
    // Ensure DB i18n is merged before first render (defensive)
    this.apiService.getI18n(currentLang).subscribe(db => {
      if (db) this.translateService.setTranslation(currentLang, db, true);
    });
    // Load home page content from DB
    this.apiService.getPageBySlug('home', currentLang).subscribe(
      page => {
        this.pageTitle = page?.title || this.translateService.instant('HOME.HERO_TITLE');
        this.pageSubtitle = page?.excerpt || this.translateService.instant('HOME.HERO_SUBTITLE');
      },
      () => {
        this.pageTitle = this.translateService.instant('HOME.HERO_TITLE');
        this.pageSubtitle = this.translateService.instant('HOME.HERO_SUBTITLE');
      }
    );
    
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
      categories => {
        this.categories = categories;
        // group by type for main category cards
        const win = categories.filter(c => c.type === 'window');
        const door = categories.filter(c => c.type === 'door');
        const reaType = categories.filter(c => c.type === 'realization');
        const rea = reaType.length ? reaType : [...win, ...door];
        this.groupedCategories = { window: win, door: door, realization: rea };
        this.computeGroupImages();
      },
      error => console.error('Error loading categories:', error)
    );
  }

  private resolveGroupHero(keys: string[], cats: any[]): string {
    for (const k of keys) {
      const mapped = this.categoryImagesMap[k];
      if (mapped) return this.siteService.resolveMediaUrl(mapped);
    }
    const first = cats && cats.length ? cats[0] : null;
    return first ? this.siteService.resolveMediaUrl(first.imageUrl) : '';
  }

  addV(url: string): string {
    if (!url) return '';
    return url + (url.includes('?') ? '&' : '?') + 'v=' + this.cacheBuster;
  }

  private computeGroupImages(): void {
    if (!this.groupedCategories) return;
    const win = this.groupedCategories.window || [];
    const door = this.groupedCategories.door || [];
    const rea = this.groupedCategories.realization || [];
    const windowHero = this.resolveGroupHero(['drevene-okna','drevohlinikove-okna','hlinikove-okna'], win);
    let doorHero = this.resolveGroupHero(['drevene-dvere','historicke-dvere','hlinikove-dvere'], door);
    let realizationHero = this.resolveGroupHero(['realizacie'], rea);
    const isHashed = (p: string) => /\/[a-f0-9]{32}\.[a-z]+$/i.test(p || '');
    if (!isHashed(doorHero) && this.siteImages.length) {
      doorHero = this.siteImages[0] || doorHero;
    }
    if (!isHashed(realizationHero) && this.siteImages.length) {
      realizationHero = this.siteImages[this.siteImages.length - 1] || this.siteImages[0];
    }
    this.groupImages = { window: windowHero, door: doorHero, realization: realizationHero };
  }
}
