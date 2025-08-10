import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { HomeHeroComponent } from './hero/home-hero.component';
import { HomeAboutComponent } from './about/home-about.component';
import { HomeCategoriesComponent } from './categories/home-categories.component';
import { Observable, Subscription, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SiteService } from '../../services/site.service';
import { HomeService, HomePageData } from './home.service';
import { CarouselService, CarouselSlide } from '../../services/carousel.service';



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
    MatGridListModule,
    HomeHeroComponent,
    HomeAboutComponent,
    HomeCategoriesComponent
  ],
  providers: [HomeService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  homePageData$!: Observable<HomePageData>;
  currentSlideIndex = 0;
  private carouselTimer$!: Subscription;

  aboutFeatures: string[] = [
    'HOME.ABOUT_FEATURES.0',
    'HOME.ABOUT_FEATURES.1',
    'HOME.ABOUT_FEATURES.2',
    'HOME.ABOUT_FEATURES.3'
  ];

  // Carousel slides will be loaded from backend
  heroSlides: CarouselSlide[] = [];

  subCategoriesMap: Record<'window' | 'door' | 'realization', string[]> = {
    window: [
      'PRODUCTS.CATEGORIES.WOODEN_WINDOWS',
      'PRODUCTS.CATEGORIES.WOOD_ALUMINUM_WINDOWS',
      'PRODUCTS.CATEGORIES.ALUMINUM_WINDOWS',
      'PRODUCTS.CATEGORIES.HISTORICAL_WINDOWS'
    ],
    door: [
      'PRODUCTS.CATEGORIES.WOODEN_DOORS',
      'PRODUCTS.CATEGORIES.HISTORICAL_DOORS',
      'PRODUCTS.CATEGORIES.ALUMINUM_DOORS',
      'PRODUCTS.CATEGORIES.SLIDING_DOORS'
    ],
    realization: [
      'PRODUCTS.CATEGORIES.WOODEN_WINDOWS',
      'PRODUCTS.CATEGORIES.WOOD_ALUMINUM_WINDOWS',
      'PRODUCTS.CATEGORIES.ALUMINUM_WINDOWS',
      'PRODUCTS.CATEGORIES.HISTORICAL_WINDOWS',
      'PRODUCTS.CATEGORIES.WOODEN_DOORS',
      'PRODUCTS.CATEGORIES.SLIDING_DOORS'
    ]
  };

            constructor(
            public homeService: HomeService,
            public siteService: SiteService,
            private carouselService: CarouselService
          ) {}

  get currentHeroSlide() {
    return this.heroSlides[this.currentSlideIndex] || this.heroSlides[0];
  }

            ngOnInit() {
            this.homePageData$ = this.homeService.getHomePageData();
            
            // Load carousel slides from backend
            this.carouselService.getCarouselSlides().subscribe({
              next: (slides) => {
                this.heroSlides = slides;
                if (this.heroSlides.length > 0) {
                  this.startCarousel(this.heroSlides.length);
                }
              },
              error: (error) => {
                console.error('Error loading carousel slides:', error);
                // Fallback to empty array
                this.heroSlides = [];
              }
            });
          }

  ngOnDestroy() {
    if (this.carouselTimer$) {
      this.carouselTimer$.unsubscribe();
    }
  }

  private startCarousel(imageCount: number): void {
    // Always use our curated hero slides for consistent experience
    const slideCount = this.heroSlides.length;
    this.carouselTimer$ = timer(0, 5000).subscribe(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % slideCount;
    });
  }
  
  addV(url: string): string {
    return this.homeService.addVersion(url);
  }

            trackBySlideId(index: number, slide: CarouselSlide): string {
            return slide.id;
          }
}
