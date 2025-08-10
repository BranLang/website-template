import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, TranslateModule],
  template: `
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2>{{ 'PRODUCTS.CATEGORIES.TITLE' | translate }}</h2>
          <p class="section-subtitle">{{ 'HOME.CATEGORIES_SUBTITLE' | translate }}</p>
        </div>

        <div class="categories-grid" *ngIf="subCategoriesMap; else categoriesSkeleton">
          <mat-card class="category-card" routerLink="/categories/windows">
            <div class="card-image-container">
              <img mat-card-image src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=350&fit=crop&q=85" alt="Windows">
              <div class="image-overlay">
                <mat-icon>window</mat-icon>
              </div>
            </div>
            <mat-card-content>
              <h3 class="card-title">{{ 'NAVIGATION.WINDOWS' | translate }}</h3>
              <div class="category-items">
                <div class="item-chip" *ngFor="let key of subCategoriesMap.window.slice(0, 3)">{{ key | translate }}</div>
                <div class="more-items" *ngIf="subCategoriesMap.window.length > 3">+{{ subCategoriesMap.window.length - 3 }} {{ 'COMMON.MORE' | translate }}</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="category-card" routerLink="/categories/doors">
            <div class="card-image-container">
              <img mat-card-image src="https://images.unsplash.com/photo-1570025924143-7a8b14c2bb0e?w=500&h=350&fit=crop&q=85" alt="Doors">
              <div class="image-overlay">
                <mat-icon>door_front</mat-icon>
              </div>
            </div>
            <mat-card-content>
              <h3 class="card-title">{{ 'NAVIGATION.DOORS' | translate }}</h3>
              <div class="category-items">
                <div class="item-chip" *ngFor="let key of subCategoriesMap.door.slice(0, 3)">{{ key | translate }}</div>
                <div class="more-items" *ngIf="subCategoriesMap.door.length > 3">+{{ subCategoriesMap.door.length - 3 }} {{ 'COMMON.MORE' | translate }}</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="category-card" routerLink="/realizations">
            <div class="card-image-container">
              <img mat-card-image src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=350&fit=crop&q=85" alt="Realizations">
              <div class="image-overlay">
                <mat-icon>photo_library</mat-icon>
              </div>
            </div>
            <mat-card-content>
              <h3 class="card-title">{{ 'NAVIGATION.REALIZATIONS' | translate }}</h3>
              <div class="category-items">
                <div class="item-chip" *ngFor="let key of subCategoriesMap.realization.slice(0, 4)">{{ key | translate }}</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <ng-template #categoriesSkeleton>
          <div class="categories-skeleton">
            <div class="skeleton-card" *ngFor="let i of [0,1,2]"></div>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .categories-skeleton { display:grid; grid-template-columns: repeat(auto-fit,minmax(320px,1fr)); gap:2rem; }
    .skeleton-card { height: 320px; border-radius: 16px; background: linear-gradient(90deg,#eee,#f5f5f5,#eee); animation: shimmer 1.6s infinite; }
    @keyframes shimmer { 0%{background-position: -200px 0;} 100%{background-position: 200px 0;} }
  `]
})
export class HomeCategoriesComponent {
  @Input() subCategoriesMap!: Record<'window' | 'door' | 'realization', string[]>;
}



