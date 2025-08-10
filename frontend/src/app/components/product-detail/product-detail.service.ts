import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { of } from 'rxjs';
import { catchError, shareReplay, switchMap } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { Language } from '../../services/language.service';

@Injectable()
export class ProductDetailService {
  product$ = this.languageService.currentLanguage$.pipe(
    switchMap(lang => this.fetchProduct(lang)),
    shareReplay(1)
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private languageService: LanguageService
  ) {}

  private fetchProduct(lang: Language) {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.router.navigate(['/products']);
      return of(null);
    }
    return this.api.getProductBySlug(slug, lang).pipe(
      catchError(() => {
        this.router.navigate(['/products']);
        return of(null);
      })
    );
  }
}
