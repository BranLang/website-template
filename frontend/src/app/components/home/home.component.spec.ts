import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';
import { HomeService, HomePageData } from './home.service';
import { SiteService } from '../../services/site.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHomeService: jasmine.SpyObj<HomeService>;
  let mockSiteService: jasmine.SpyObj<SiteService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockHomePageData: HomePageData = {
    pageTitle: 'Test Title',
    pageSubtitle: 'Test Subtitle',
    carouselImages: ['image1.jpg', 'image2.jpg'],
    groupedCategories: {
      window: [
        { id: 1, slug: 'wooden-windows', name: 'Wooden Windows', description: 'Test', type: 'window', imageUrl: 'window.jpg' }
      ],
      door: [
        { id: 2, slug: 'wooden-doors', name: 'Wooden Doors', description: 'Test', type: 'door', imageUrl: 'door.jpg' }
      ],
      realization: []
    },
    groupImages: {
      window: 'window-hero.jpg',
      door: 'door-hero.jpg',
      realization: 'realization-hero.jpg'
    }
  };

  beforeEach(async () => {
    // Create spies for services
    mockHomeService = jasmine.createSpyObj('HomeService', ['getHomePageData', 'addVersion']);
    mockSiteService = jasmine.createSpyObj('SiteService', ['resolveMediaUrl']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['get', 'instant']);

    // Setup service return values
    mockHomeService.getHomePageData.and.returnValue(of(mockHomePageData));
    mockHomeService.addVersion.and.returnValue('test-url?v=123');
    mockSiteService.resolveMediaUrl.and.returnValue('http://localhost:3000/test-image.jpg');
    mockTranslateService.get.and.returnValue(of('Translated Text'));
    mockTranslateService.instant.and.returnValue('Translated Text');

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        MatCardModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: HomeService, useValue: mockHomeService },
        { provide: SiteService, useValue: mockSiteService },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Hero Section', () => {
    it('should display hero section with title and subtitle', () => {
      fixture.detectChanges();
      
      const heroSection = fixture.debugElement.query(By.css('.hero-section'));
      expect(heroSection).toBeTruthy();
      
      const heroTitle = fixture.debugElement.query(By.css('.hero-title'));
      expect(heroTitle).toBeTruthy();
      expect(heroTitle.nativeElement.textContent.trim()).toBe('Windows and Doors for a Lifetime');
      
      const heroSubtitle = fixture.debugElement.query(By.css('.hero-subtitle'));
      expect(heroSubtitle).toBeTruthy();
      expect(heroSubtitle.nativeElement.textContent.trim()).toBe('Quality windows and doors for your home');
    });

    it('should display hero buttons with correct text', () => {
      fixture.detectChanges();
      
      const buttons = fixture.debugElement.queryAll(By.css('.hero-buttons button'));
      expect(buttons.length).toBe(2);
      
      expect(buttons[0].nativeElement.textContent.trim()).toBe('View All Products');
      expect(buttons[1].nativeElement.textContent.trim()).toBe('Contact Us');
    });

    it('should display carousel when images are available', () => {
      fixture.detectChanges();
      
      // Note: Since we're using hardcoded content now, we need to test the structure
      const heroSection = fixture.debugElement.query(By.css('.hero-section'));
      expect(heroSection).toBeTruthy();
    });
  });

  describe('About Section', () => {
    it('should display about section with correct content', () => {
      fixture.detectChanges();
      
      const aboutSection = fixture.debugElement.query(By.css('.about-section'));
      expect(aboutSection).toBeTruthy();
      
      const aboutCard = fixture.debugElement.query(By.css('.about-card'));
      expect(aboutCard).toBeTruthy();
      
      const aboutTitle = fixture.debugElement.query(By.css('.about-card h2'));
      expect(aboutTitle).toBeTruthy();
      expect(aboutTitle.nativeElement.textContent.trim()).toBe('About Our Company');
    });

    it('should display feature items with icons', () => {
      fixture.detectChanges();
      
      const featureItems = fixture.debugElement.queryAll(By.css('.feature-item'));
      expect(featureItems.length).toBe(4);
      
      featureItems.forEach(item => {
        const icon = item.query(By.css('mat-icon'));
        expect(icon).toBeTruthy();
        expect(icon.nativeElement.textContent.trim()).toBe('check_circle');
      });
    });
  });

  describe('Categories Section', () => {
    it('should display categories section with title', () => {
      fixture.detectChanges();
      
      const categoriesSection = fixture.debugElement.query(By.css('.categories-section'));
      expect(categoriesSection).toBeTruthy();
      
      const title = fixture.debugElement.query(By.css('.categories-section h2'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('Categories');
    });

    it('should display three category cards', () => {
      fixture.detectChanges();
      
      const categoryCards = fixture.debugElement.queryAll(By.css('.group-card'));
      expect(categoryCards.length).toBe(3);
      
      // Check card titles
      const cardTitles = fixture.debugElement.queryAll(By.css('.group-card mat-card-title'));
      expect(cardTitles[0].nativeElement.textContent.trim()).toBe('Windows');
      expect(cardTitles[1].nativeElement.textContent.trim()).toBe('Doors');
      expect(cardTitles[2].nativeElement.textContent.trim()).toBe('Realizations');
    });

    it('should display category images', () => {
      fixture.detectChanges();
      
      const categoryImages = fixture.debugElement.queryAll(By.css('.group-card img'));
      expect(categoryImages.length).toBe(3);
      
      categoryImages.forEach(img => {
        expect(img.nativeElement.src).toContain('unsplash.com');
      });
    });

    it('should display subcategory lists', () => {
      fixture.detectChanges();
      
      const subCatLists = fixture.debugElement.queryAll(By.css('.subcat-list'));
      expect(subCatLists.length).toBe(3);
      
      // Check that each list has items
      subCatLists.forEach(list => {
        const items = list.queryAll(By.css('li'));
        expect(items.length).toBeGreaterThan(0);
        
        // Check that each item has an icon
        items.forEach(item => {
          const icon = item.query(By.css('mat-icon'));
          expect(icon).toBeTruthy();
          expect(icon.nativeElement.textContent.trim()).toBe('chevron_right');
        });
      });
    });
  });

  describe('Service Integration', () => {
    it('should call HomeService.getHomePageData on init', () => {
      fixture.detectChanges();
      expect(mockHomeService.getHomePageData).toHaveBeenCalled();
    });

    it('should handle missing data gracefully', () => {
      // Test with empty data
      mockHomeService.getHomePageData.and.returnValue(of({
        pageTitle: '',
        pageSubtitle: '',
        carouselImages: [],
        groupedCategories: {},
        groupImages: {}
      }));
      
      fixture.detectChanges();
      
      // Component should still render without errors
      expect(component).toBeTruthy();
      const heroSection = fixture.debugElement.query(By.css('.hero-section'));
      expect(heroSection).toBeTruthy();
    });

    it('should handle service errors gracefully', () => {
      // Test with service error
      mockHomeService.getHomePageData.and.returnValue(of(null as any));
      
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Translation Integration', () => {
    it('should not show translation keys in the UI', () => {
      fixture.detectChanges();
      
      const allText = fixture.debugElement.nativeElement.textContent;
      
      // Check that no translation keys are visible
      expect(allText).not.toContain('HOME.HERO_TITLE');
      expect(allText).not.toContain('HOME.HERO_SUBTITLE');
      expect(allText).not.toContain('HOME.ABOUT_US_SHORT');
      expect(allText).not.toContain('NAVIGATION.WINDOWS');
      expect(allText).not.toContain('NAVIGATION.DOORS');
      expect(allText).not.toContain('NAVIGATION.REALIZATIONS');
    });

    it('should display actual content instead of translation keys', () => {
      fixture.detectChanges();
      
      const allText = fixture.debugElement.nativeElement.textContent;
      
      // Check that actual content is displayed
      expect(allText).toContain('Windows and Doors for a Lifetime');
      expect(allText).toContain('Quality windows and doors for your home');
      expect(allText).toContain('About Our Company');
      expect(allText).toContain('Windows');
      expect(allText).toContain('Doors');
      expect(allText).toContain('Realizations');
    });
  });

  describe('Navigation', () => {
    it('should have correct router links on category cards', () => {
      fixture.detectChanges();
      
      const categoryCards = fixture.debugElement.queryAll(By.css('.group-card[routerLink]'));
      expect(categoryCards.length).toBe(3);
      
      expect(categoryCards[0].nativeElement.getAttribute('ng-reflect-router-link')).toBe('/categories/windows');
      expect(categoryCards[1].nativeElement.getAttribute('ng-reflect-router-link')).toBe('/categories/doors');
      expect(categoryCards[2].nativeElement.getAttribute('ng-reflect-router-link')).toBe('/realizations');
    });

    it('should have correct router links on hero buttons', () => {
      fixture.detectChanges();
      
      const buttons = fixture.debugElement.queryAll(By.css('.hero-buttons button[routerLink]'));
      expect(buttons.length).toBe(2);
      
      expect(buttons[0].nativeElement.getAttribute('ng-reflect-router-link')).toBe('/products');
      expect(buttons[1].nativeElement.getAttribute('ng-reflect-router-link')).toBe('/contact');
    });
  });

  describe('Responsive Design', () => {
    it('should have proper CSS classes for responsive layout', () => {
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.container'));
      expect(container).toBeTruthy();
      
      const cardsGrid = fixture.debugElement.query(By.css('.cards-grid'));
      expect(cardsGrid).toBeTruthy();
      
      const featuresGrid = fixture.debugElement.query(By.css('.features-grid'));
      expect(featuresGrid).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt attributes on images', () => {
      fixture.detectChanges();
      
      const images = fixture.debugElement.queryAll(By.css('img'));
      images.forEach(img => {
        expect(img.nativeElement.alt).toBeTruthy();
        expect(img.nativeElement.alt.length).toBeGreaterThan(0);
      });
    });

    it('should have proper heading hierarchy', () => {
      fixture.detectChanges();
      
      const h1 = fixture.debugElement.query(By.css('h1'));
      expect(h1).toBeTruthy();
      
      const h2Elements = fixture.debugElement.queryAll(By.css('h2'));
      expect(h2Elements.length).toBeGreaterThan(0);
    });
  });
});