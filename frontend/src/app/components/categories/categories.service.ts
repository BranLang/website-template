import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { Language } from '../../services/language.service';

export interface CategoryPageData {
  category: Category | null;
  products: Product[];
}

@Injectable()
export class CategoriesService {
  categoryPageData$ = this.languageService.currentLanguage$.pipe(
    switchMap(lang => this.fetchCategoryPageData(lang)),
    shareReplay(1)
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private languageService: LanguageService
  ) {}

  private fetchCategoryPageData(lang: Language) {
    const type = this.route.snapshot.paramMap.get('type');
    if (!type) {
      this.router.navigate(['/']);
      return of(null);
    }

    return this.api.getCategoriesByType(type, lang).pipe(
      switchMap(categories => {
        if (categories.length === 0) {
          return of({ category: null, products: [] });
        }
        const category = categories[0];
        return this.api.getProductsByCategory(category.id, lang).pipe(
          map(products => ({ category, products }))
        );
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
