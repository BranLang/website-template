import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarouselSlide } from '../../../services/carousel.service';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatButtonModule, MatIconModule],
  template: `
    <section class="hero-section mat-elevation-z2">
      <div class="hero-carousel" *ngIf="slides?.length; else heroSkeleton">
        <div class="carousel-track" [style.transform]="'translateX(-' + currentSlideIndex * 100 + '%)'">
          <div class="carousel-slide" *ngFor="let slide of slides; trackBy: trackBySlideId">
            <img [src]="slide.imageUrl" [attr.alt]="slide.imageAlt || (slide.titleTranslationId | translate)" />
          </div>
        </div>
      </div>
      <ng-template #heroSkeleton>
        <div class="hero-skeleton">
          <div class="skeleton-image"></div>
          <div class="skeleton-title"></div>
          <div class="skeleton-subtitle"></div>
          <div class="skeleton-buttons"></div>
        </div>
      </ng-template>

      <div class="hero-content" *ngIf="currentSlide">
        <h1 class="hero-title">{{ currentSlide.titleTranslationId | translate }}</h1>
        <p class="hero-subtitle">{{ currentSlide.subtitleTranslationId | translate }}</p>
        <div class="hero-buttons">
          <button mat-raised-button color="primary" routerLink="/products">{{ 'HOME.VIEW_ALL_PRODUCTS' | translate }}</button>
          <button mat-stroked-button routerLink="/contact">{{ 'HOME.CONTACT_US' | translate }}</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-skeleton { position: relative; height: 300px; display: grid; place-items: center; padding: 2rem; }
    .skeleton-image { position: absolute; inset: 0; background: linear-gradient(90deg,#eee,#f5f5f5,#eee); animation: shimmer 1.6s infinite; }
    .skeleton-title, .skeleton-subtitle, .skeleton-buttons { width: 60%; height: 20px; background: #eee; margin: 10px 0; border-radius: 6px; opacity: 0.6; }
    .skeleton-title { height: 28px; }
    @keyframes shimmer { 0%{background-position: -200px 0;} 100%{background-position: 200px 0;} }
  `]
})
export class HomeHeroComponent {
  @Input() slides: CarouselSlide[] = [];
  @Input() currentSlideIndex = 0;

  get currentSlide(): CarouselSlide | undefined {
    return this.slides?.length ? this.slides[this.currentSlideIndex] : undefined;
  }

  trackBySlideId(index: number, slide: CarouselSlide): string {
    return slide.id;
  }
}


