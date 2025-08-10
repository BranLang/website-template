import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { HomeService, HomePageData } from './home.service';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { SiteService } from '../../services/site.service';

describe('HomeService', () => {
  let service: HomeService;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockLanguageService: jasmine.SpyObj<LanguageService>;
  let mockSiteService: jasmine.SpyObj<SiteService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockPage = {
    id: 1,
    slug: 'home',
    title: 'Test Home Title',
    content: 'Test content',
    excerpt: 'Test subtitle'
  };

  const mockCategories = [
    { id: 1, slug: 'wooden-windows', name: 'Wooden Windows', description: 'Test', type: 'window', imageUrl: 'window.jpg' },
    { id: 2, slug: 'wooden-doors', name: 'Wooden Doors', description: 'Test', type: 'door', imageUrl: 'door.jpg' },
    { id: 3, slug: 'aluminum-windows', name: 'Aluminum Windows', description: 'Test', type: 'window', imageUrl: 'window2.jpg' }
  ];

  const mockSiteSettings = {
    images: ['site1.jpg', 'site2.jpg', 'site3.jpg'],
    categoryImages: {
      'windows': 'window-hero.jpg',
      'doors': 'door-hero.jpg'
    }
  };

  const mockI18nData = {
    'HOME.HERO_TITLE': 'Default Hero Title',
    'HOME.HERO_SUBTITLE': 'Default Hero Subtitle'
  };

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getPageBySlug', 'getCategories', 'getI18n']);
    mockLanguageService = jasmine.createSpyObj('LanguageService', [], {
      currentLanguage$: of('en')
    });
    mockSiteService = jasmine.createSpyObj('SiteService', ['resolveMediaUrl'], {
      site$: of({ settings: mockSiteSettings })
    });
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant', 'setTranslation']);

    TestBed.configureTestingModule({
      providers: [
        HomeService,
        { provide: ApiService, useValue: mockApiService },
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: SiteService, useValue: mockSiteService },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    });
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHomePageData', () => {
    beforeEach(() => {
      mockApiService.getPageBySlug.and.returnValue(of(mockPage));
      mockApiService.getCategories.and.returnValue(of(mockCategories));
      mockApiService.getI18n.and.returnValue(of(mockI18nData));
      mockSiteService.resolveMediaUrl.and.returnValue('http://localhost:3000/test.jpg');
      mockTranslateService.instant.and.returnValue('Translated Text');
    });

    it('should return home page data successfully', (done) => {
      service.getHomePageData().subscribe((data: HomePageData) => {
        expect(data).toBeTruthy();
        expect(data.pageTitle).toBe('Test Home Title');
        expect(data.pageSubtitle).toBe('Test subtitle');
        expect(data.carouselImages).toEqual(['site1.jpg', 'site2.jpg', 'site3.jpg']);
        expect(data.groupedCategories).toBeTruthy();
        expect(data.groupImages).toBeTruthy();
        done();
      });
    });

    it('should group categories correctly', (done) => {
      service.getHomePageData().subscribe((data: HomePageData) => {
        expect(data.groupedCategories['window']).toHaveSize(2);
        expect(data.groupedCategories['door']).toHaveSize(1);
        expect(data.groupedCategories['realization']).toBeDefined();
        done();
      });
    });

    it('should handle missing page data gracefully', (done) => {
      mockApiService.getPageBySlug.and.returnValue(throwError('Page not found'));
      
      service.getHomePageData().subscribe((data: HomePageData) => {
        expect(data.pageTitle).toBe('Translated Text'); // fallback to translated title
        expect(data.pageSubtitle).toBe('Translated Text'); // fallback to translated subtitle
        done();
      });
    });

    it('should handle missing categories gracefully', (done) => {
      mockApiService.getCategories.and.returnValue(throwError('Categories not found'));
      
      service.getHomePageData().subscribe((data: HomePageData) => {
        expect(data.groupedCategories).toEqual({
          window: [],
          door: [],
          realization: []
        });
        done();
      });
    });

    it('should handle missing site settings gracefully', (done) => {
      mockSiteService.site$ = of(null);
      
      service.getHomePageData().subscribe((data: HomePageData) => {
        expect(data.carouselImages).toEqual([]);
        expect(data.groupImages).toBeTruthy();
        done();
      });
    });

    it('should handle missing i18n data gracefully', (done) => {
      mockApiService.getI18n.and.returnValue(throwError('I18n not found'));
      
      service.getHomePageData().subscribe((data: HomePageData) => {
        expect(data).toBeTruthy();
        // Should still return data even without translations
        done();
      });
    });

    it('should set translations when i18n data is loaded', (done) => {
      service.getHomePageData().subscribe(() => {
        expect(mockTranslateService.setTranslation).toHaveBeenCalledWith('en', mockI18nData, true);
        done();
      });
    });
  });

  describe('addVersion', () => {
    it('should add version parameter to URL', () => {
      const url = 'http://example.com/image.jpg';
      const result = service.addVersion(url);
      
      expect(result).toMatch(/http:\/\/example\.com\/image\.jpg\?v=\d+/);
    });

    it('should handle URLs with existing parameters', () => {
      const url = 'http://example.com/image.jpg?param=value';
      const result = service.addVersion(url);
      
      expect(result).toMatch(/http:\/\/example\.com\/image\.jpg\?param=value&v=\d+/);
    });

    it('should handle empty URL', () => {
      const result = service.addVersion('');
      expect(result).toBe('');
    });

    it('should handle null URL', () => {
      const result = service.addVersion(null as any);
      expect(result).toBe('');
    });
  });

  describe('groupCategories', () => {
    it('should group categories by type correctly', () => {
      const grouped = (service as any).groupCategories(mockCategories);
      
      expect(grouped.window).toHaveSize(2);
      expect(grouped.door).toHaveSize(1);
      expect(grouped.realization).toBeDefined();
      
      // Check specific categories
      expect(grouped.window.find((c: any) => c.slug === 'wooden-windows')).toBeTruthy();
      expect(grouped.window.find((c: any) => c.slug === 'aluminum-windows')).toBeTruthy();
      expect(grouped.door.find((c: any) => c.slug === 'wooden-doors')).toBeTruthy();
    });

    it('should handle empty categories array', () => {
      const grouped = (service as any).groupCategories([]);
      
      expect(grouped.window).toEqual([]);
      expect(grouped.door).toEqual([]);
      expect(grouped.realization).toEqual([]);
    });

    it('should create realization group from window and door categories when no realization type exists', () => {
      const grouped = (service as any).groupCategories(mockCategories);
      
      // Since there are no 'realization' type categories, it should combine window and door
      expect(grouped.realization.length).toBeGreaterThan(0);
    });
  });

  describe('computeGroupImages', () => {
    const mockGroupedCategories = {
      window: [{ imageUrl: 'window-default.jpg' }],
      door: [{ imageUrl: 'door-default.jpg' }],
      realization: []
    };

    const mockCategoryImagesMap = {
      'windows': 'window-hero.jpg',
      'doors': 'door-hero.jpg'
    };

    const mockSiteImages = ['site1.jpg', 'site2.jpg'];

    beforeEach(() => {
      mockSiteService.resolveMediaUrl.and.returnValue('http://localhost:3000/resolved.jpg');
    });

    it('should compute group images correctly', () => {
      const groupImages = (service as any).computeGroupImages(
        mockGroupedCategories,
        mockCategoryImagesMap,
        mockSiteImages
      );
      
      expect(groupImages.window).toBeTruthy();
      expect(groupImages.door).toBeTruthy();
      expect(groupImages.realization).toBeTruthy();
    });

    it('should use site images as fallback', () => {
      const emptyCategories = { window: [], door: [], realization: [] };
      const emptyCategoryImages = {};
      
      const groupImages = (service as any).computeGroupImages(
        emptyCategories,
        emptyCategoryImages,
        mockSiteImages
      );
      
      expect(groupImages.door).toBe(mockSiteImages[0]);
      expect(groupImages.realization).toBe(mockSiteImages[mockSiteImages.length - 1]);
    });

    it('should handle empty inputs gracefully', () => {
      const groupImages = (service as any).computeGroupImages({}, {}, []);
      
      expect(groupImages.window).toBe('');
      expect(groupImages.door).toBe('');
      expect(groupImages.realization).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should handle API service errors gracefully', (done) => {
      mockApiService.getPageBySlug.and.returnValue(throwError('API Error'));
      mockApiService.getCategories.and.returnValue(throwError('API Error'));
      mockApiService.getI18n.and.returnValue(throwError('API Error'));
      
      service.getHomePageData().subscribe({
        next: (data) => {
          expect(data).toBeTruthy();
          done();
        },
        error: () => {
          fail('Should not throw error, should handle gracefully');
        }
      });
    });

    it('should handle network errors gracefully', (done) => {
      mockApiService.getPageBySlug.and.returnValue(throwError({ status: 0, message: 'Network error' }));
      mockApiService.getCategories.and.returnValue(of([]));
      mockApiService.getI18n.and.returnValue(of({}));
      
      service.getHomePageData().subscribe({
        next: (data) => {
          expect(data).toBeTruthy();
          done();
        },
        error: () => {
          fail('Should not throw error, should handle gracefully');
        }
      });
    });
  });
});
