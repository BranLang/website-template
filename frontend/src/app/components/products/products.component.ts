import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

import { SiteService } from '../../services/site.service';
import { ProductsService, ProductsPageData } from './products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatCardModule, MatButtonModule, MatIconModule],
  providers: [ProductsService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productsPageData$!: Observable<ProductsPageData>;

  constructor(
    private productsService: ProductsService,
    public siteService: SiteService,
  ) {}

  ngOnInit(): void {
    this.productsPageData$ = this.productsService.getProductsPageData();
  }
}
