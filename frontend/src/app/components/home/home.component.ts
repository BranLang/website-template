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
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{{ 'HOME.HERO_TITLE' | translate }}</h1>
        <p class="hero-subtitle">{{ 'HOME.HERO_SUBTITLE' | translate }}</p>
        <div class="hero-buttons">
          <button mat-raised-button color="primary" routerLink="/products">
            {{ 'HOME.VIEW_ALL_PRODUCTS' | translate }}
          </button>
          <button mat-stroked-button routerLink="/contact">
            {{ 'HOME.CONTACT_US' | translate }}
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <h2>{{ 'HOME.ABOUT_US_SHORT' | translate }}</h2>
          <div class="features-grid">
            <div class="feature-item" *ngFor="let feature of aboutFeatures">
              <mat-icon>check_circle</mat-icon>
              <span>{{ feature | translate }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="products-section" *ngIf="featuredProducts.length > 0">
      <div class="container">
        <h2>{{ 'HOME.FEATURED_PRODUCTS' | translate }}</h2>
        <div class="products-grid">
          <mat-card class="product-card" *ngFor="let product of featuredProducts">
            <img mat-card-image [src]="product.mainImageUrl || 'assets/images/placeholder.jpg'" [alt]="product.name">
            <mat-card-content>
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="product-price" *ngIf="product.price">
                {{ product.price | currency:'EUR':'symbol':'1.2-2' }}
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button [routerLink]="['/products', product.slug]">
                {{ 'PRODUCTS.VIEW_DETAILS' | translate }}
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section" *ngIf="categories.length > 0">
      <div class="container">
        <h2>{{ 'PRODUCTS.CATEGORIES.TITLE' | translate }}</h2>
        <div class="categories-grid">
          <mat-card class="category-card" *ngFor="let category of categories" [routerLink]="['/categories', category.slug]">
            <img mat-card-image [src]="category.imageUrl || 'assets/images/placeholder.jpg'" [alt]="category.name">
            <mat-card-content>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 0;
      text-align: center;
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .hero-buttons button {
      padding: 12px 24px;
      font-size: 1.1rem;
    }

    .about-section {
      padding: 80px 0;
      background-color: #f8f9fa;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .about-content h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .feature-item mat-icon {
      color: #4caf50;
      font-size: 2rem;
    }

    .products-section {
      padding: 80px 0;
    }

    .products-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .product-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .product-card img {
      height: 200px;
      object-fit: cover;
    }

    .product-card h3 {
      font-size: 1.3rem;
      margin: 1rem 0 0.5rem 0;
      color: #333;
    }

    .product-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #4caf50;
      margin-top: 0.5rem;
    }

    .categories-section {
      padding: 80px 0;
      background-color: #f8f9fa;
    }

    .categories-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .category-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .category-card img {
      height: 180px;
      object-fit: cover;
    }

    .category-card h3 {
      font-size: 1.2rem;
      margin: 1rem 0 0.5rem 0;
      color: #333;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.2rem;
      }

      .hero-buttons {
        flex-direction: column;
        align-items: center;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .products-grid,
      .categories-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  categories: any[] = [];
  aboutFeatures: string[] = [
    'HOME.ABOUT_FEATURES.0',
    'HOME.ABOUT_FEATURES.1',
    'HOME.ABOUT_FEATURES.2',
    'HOME.ABOUT_FEATURES.3'
  ];

  constructor(
    private apiService: ApiService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.translateService.use(lang);
      this.loadData();
    });
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const currentLang = this.languageService.getCurrentLanguage();
    
    // Load featured products
    this.apiService.getFeaturedProducts(currentLang).subscribe(
      products => this.featuredProducts = products,
      error => console.error('Error loading featured products:', error)
    );

    // Load categories
    this.apiService.getCategories(currentLang).subscribe(
      categories => this.categories = categories,
      error => console.error('Error loading categories:', error)
    );
  }
}
