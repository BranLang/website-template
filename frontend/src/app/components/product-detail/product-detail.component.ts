import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { SiteService } from '../../services/site.service';
import { ProductDetailService } from './product-detail.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule, MatButtonModule, MatIconModule],
  providers: [ProductDetailService],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product | null>;

  constructor(
    private productDetailService: ProductDetailService,
    public siteService: SiteService
  ) {}

  ngOnInit(): void {
    this.product$ = this.productDetailService.product$;
  }
}
