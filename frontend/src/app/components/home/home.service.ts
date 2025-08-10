import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Language, LanguageService } from '../../services/language.service';
import { SiteService } from '../../services/site.service';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, of, Observable } from 'rxjs';
import { map, catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Category } from '../../models/category.model';

export interface HomePageData {
  pageTitle: string;
  pageSubtitle: string;
  carouselImages: string[];
  groupedCategories: { [key: string]: Category[] };
  groupImages: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private cacheBuster = Date.now();
  private homePageData$ = this.languageService.currentLanguage$.pipe(
    switchMap(lang => this.fetchHomePageData(lang)),
    shareReplay(1)
  );

  constructor(
    private apiService: ApiService,
    private languageService: LanguageService,
    private siteService: SiteService,
    private translate: TranslateService
  ) {}

  getHomePageData(): Observable<HomePageData> {
    return this.homePageData$;
  }

  private fetchHomePageData(lang: Language) {
    return combineLatest([
      this.apiService.getPageBySlug('home', lang).pipe(
        catchError(() => of(null))
      ),
      this.apiService.getCategories(lang).pipe(
        catchError(() => of([]))
      ),
      this.siteService.site$.pipe(
        map(site => site?.settings || {}),
        catchError(() => of({}))
      ),
      this.apiService.getI18n(lang).pipe(
        catchError(() => of({}))
      )
    ]).pipe(
      tap(([_, __, ___, i18nData]) => {
        this.translate.setTranslation(lang, i18nData, true);
      }),
      map(([page, categories, siteSettings, _]) => {
        const pageTitle = page?.title || this.translate.instant('HOME.HERO_TITLE');
        const pageSubtitle = page?.excerpt || this.translate.instant('HOME.HERO_SUBTITLE');
        const siteImages = (siteSettings?.images || []).map((img: string) => this.siteService.resolveMediaUrl(img));
        const carouselImages = Array.from(new Set((siteSettings?.images || []).filter(Boolean))) as string[];
        const categoryImagesMap = siteSettings?.categoryImages || {};
        const groupedCategories = this.groupCategories(categories as Category[]);
        const groupImages = this.computeGroupImages(groupedCategories, categoryImagesMap, siteImages);
        return {
          pageTitle,
          pageSubtitle,
          carouselImages,
          groupedCategories,
          groupImages
        };
      })
    );
  }

  private groupCategories(categories: Category[]): { [key: string]: Category[] } {
    const groups: { [key: string]: Category[] } = {
      window: categories.filter(c => c.type === 'window'),
      door: categories.filter(c => c.type === 'door'),
      realization: []
    };
    const realizationType = categories.filter(c => c.type === 'realization');
    groups['realization'] = realizationType.length ? realizationType : [...groups['window'], ...groups['door']];
    return groups;
  }

  private computeGroupImages(
    groupedCategories: { [key: string]: Category[] },
    categoryImagesMap: Record<string, string>,
    siteImages: string[]
  ): { [key: string]: string } {
    const resolveGroupHero = (keys: string[], cats: Category[]): string => {
      for (const k of keys) {
        if (categoryImagesMap[k]) {
          return this.siteService.resolveMediaUrl(categoryImagesMap[k]);
        }
      }
      return cats.length > 0 ? this.siteService.resolveMediaUrl(cats[0].imageUrl) : '';
    };

    const windowHero = resolveGroupHero(['windows', 'drevene-okna'], groupedCategories['window']);
    let doorHero = resolveGroupHero(['doors', 'drevene-dvere'], groupedCategories['door']);
    let realizationHero = resolveGroupHero(['realizacie'], groupedCategories['realization']);

    const isHashed = (p: string) => /\/[a-f0-9]{32}\.[a-z]+$/i.test(p || '');
    if (!isHashed(doorHero) && siteImages.length > 0) {
      doorHero = siteImages[0];
    }
    if (!isHashed(realizationHero) && siteImages.length > 0) {
      realizationHero = siteImages[siteImages.length - 1] || siteImages[0];
    }

    return {
      window: windowHero,
      door: doorHero,
      realization: realizationHero
    };
  }

  public addVersion(url: string): string {
    if (!url) {
      return '';
    }
    return `${url}${url.includes('?') ? '&' : '?'}v=${this.cacheBuster}`;
  }
}
