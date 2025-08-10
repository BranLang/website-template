import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, of } from 'rxjs';
import { map, catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { Language } from '../../services/language.service';

export interface ProductsPageData {
  pageTitle: string;
  pageSubtitle: string;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsPageData$ = this.languageService.currentLanguage$.pipe(
    switchMap(lang => this.fetchProductsPageData(lang)),
    shareReplay(1)
  );

  constructor(
    private apiService: ApiService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  getProductsPageData() {
    return this.productsPageData$;
  }

  private fetchProductsPageData(lang: Language) {
    return combineLatest([
      this.apiService.getPageBySlug('products', lang).pipe(
        catchError(() => of(null))
      ),
      this.apiService.getProducts(lang).pipe(
        catchError(() => of([]))
      )
    ]).pipe(
      map(([page, products]) => {
        const pageTitle = page?.title || this.translate.instant('COMMON.PRODUCTS');
        const pageSubtitle = page?.excerpt || '';
        const uniqueProducts = this.filterUniqueProducts(products);
        return {
          pageTitle,
          pageSubtitle,
          products: uniqueProducts
        };
      })
    );
  }

  private filterUniqueProducts(products: Product[]): Product[] {
    const seen = new Set<string>();
    return products.filter(p => {
      const key = (p.slug && String(p.slug).trim()) || p.mainImageUrl || String(p.id);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
