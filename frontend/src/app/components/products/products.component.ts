import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  pageTitle = '';
  pageSubtitle = '';

  constructor(
    private api: ApiService,
    private language: LanguageService,
    private translate: TranslateService,
    public siteService: SiteService,
  ) {}

  ngOnInit(): void {
    this.language.currentLanguage$.subscribe(() => this.load());
    this.load();
  }

  private load(): void {
    const lang = this.language.getCurrentLanguage();
    this.api.getPageBySlug('products', lang).subscribe(
      page => {
        this.pageTitle = page?.title || this.translate.instant('COMMON.PRODUCTS');
        this.pageSubtitle = page?.excerpt || '';
      },
      () => {
        this.pageTitle = this.translate.instant('COMMON.PRODUCTS');
        this.pageSubtitle = '';
      }
    );

    this.api.getProducts(lang).subscribe(list => {
      // De-duplicate client-side by slug -> imageUrl -> id
      const seen = new Set<string>();
      this.products = list.filter(p => {
        const key = (p.slug && String(p.slug).trim()) || p.mainImageUrl || String(p.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
  }
}
