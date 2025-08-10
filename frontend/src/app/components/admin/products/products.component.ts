import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="admin-products-container">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>{{ 'ADMIN.PRODUCTS.TITLE' | translate }}</h1>
            <p>{{ 'ADMIN.PRODUCTS.SUBTITLE' | translate }}</p>
          </div>
          <button mat-raised-button color="primary" (click)="openProductForm()">
            <mat-icon>add</mat-icon>
            {{ 'ADMIN.PRODUCTS.ADD_NEW' | translate }}
          </button>
        </div>

        <!-- Filters and Search -->
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>{{ 'ADMIN.PRODUCTS.SEARCH' | translate }}</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="{{ 'ADMIN.PRODUCTS.SEARCH_PLACEHOLDER' | translate }}">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="category-filter">
                <mat-label>{{ 'ADMIN.PRODUCTS.CATEGORY_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedCategory" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.PRODUCTS.ALL_CATEGORIES' | translate }}</mat-option>
                  <mat-option *ngFor="let category of categories" [value]="category.id">
                    {{ category.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="status-filter">
                <mat-label>{{ 'ADMIN.PRODUCTS.STATUS_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.PRODUCTS.ALL_STATUSES' | translate }}</mat-option>
                  <mat-option value="true">{{ 'ADMIN.PRODUCTS.ACTIVE' | translate }}</mat-option>
                  <mat-option value="false">{{ 'ADMIN.PRODUCTS.INACTIVE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="featured-filter">
                <mat-label>{{ 'ADMIN.PRODUCTS.FEATURED_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedFeatured" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.PRODUCTS.ALL_PRODUCTS' | translate }}</mat-option>
                  <mat-option value="true">{{ 'ADMIN.PRODUCTS.FEATURED_ONLY' | translate }}</mat-option>
                  <mat-option value="false">{{ 'ADMIN.PRODUCTS.NOT_FEATURED' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Products Table -->
        <mat-card class="table-card">
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="filteredProducts" matSort (matSortChange)="sortData($event)" class="products-table">
                <!-- ID Column -->
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PRODUCTS.ID' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> {{ product.id }} </td>
                </ng-container>

                <!-- Image Column -->
                <ng-container matColumnDef="image">
                  <th mat-header-cell *matHeaderCellDef> {{ 'ADMIN.PRODUCTS.IMAGE' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> 
                    <div class="product-image">
                      <img *ngIf="product.mainImageUrl" [src]="product.mainImageUrl" [alt]="product.name" class="product-thumbnail">
                      <div *ngIf="!product.mainImageUrl" class="no-image">
                        <mat-icon>image</mat-icon>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PRODUCTS.NAME' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> 
                    <div class="product-name">
                      <span class="product-title">{{ product.name || 'N/A' }}</span>
                      <span class="product-slug">{{ product.slug || 'N/A' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Category Column -->
                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PRODUCTS.CATEGORY' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> 
                    <mat-chip *ngIf="product.category" [color]="'primary'" selected>
                      {{ product.category.name }}
                    </mat-chip>
                    <span *ngIf="!product.category" class="no-category">N/A</span>
                  </td>
                </ng-container>

                <!-- Price Column -->
                <ng-container matColumnDef="price">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PRODUCTS.PRICE' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> 
                    <span class="product-price">{{ product.price | currency:'EUR' }}</span>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PRODUCTS.STATUS' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> 
                    <mat-chip [color]="product.isActive ? 'primary' : 'warn'" selected>
                      {{ product.isActive ? ('ADMIN.PRODUCTS.ACTIVE' | translate) : ('ADMIN.PRODUCTS.INACTIVE' | translate) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Featured Column -->
                <ng-container matColumnDef="isFeatured">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PRODUCTS.FEATURED' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> 
                    <mat-chip [color]="product.isFeatured ? 'accent' : 'default'" selected>
                      {{ product.isFeatured ? ('ADMIN.PRODUCTS.FEATURED' | translate) : ('ADMIN.PRODUCTS.NOT_FEATURED' | translate) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Sort Order Column -->
                <ng-container matColumnDef="sortOrder">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PRODUCTS.SORT_ORDER' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> {{ product.sortOrder || 0 }} </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> {{ 'ADMIN.PRODUCTS.ACTIONS' | translate }} </th>
                  <td mat-cell *matCellDef="let product"> 
                    <div class="action-buttons">
                      <button mat-icon-button matTooltip="{{ 'ADMIN.PRODUCTS.EDIT' | translate }}" (click)="editProduct(product)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button matTooltip="{{ 'ADMIN.PRODUCTS.DELETE' | translate }}" (click)="deleteProduct(product)" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <!-- No Data Message -->
              <div *ngIf="filteredProducts.length === 0" class="no-data">
                <mat-icon>inventory</mat-icon>
                <p>{{ 'ADMIN.PRODUCTS.NO_PRODUCTS' | translate }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <mat-paginator 
              [length]="totalProducts"
              [pageSize]="pageSize"
              [pageSizeOptions]="[5, 10, 25, 50]"
              (page)="onPageChange($event)"
              showFirstLastButtons>
            </mat-paginator>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-products-container {
      padding: 80px 0;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-content h1 {
      font-size: 2.5rem;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .header-content p {
      color: #666;
      margin: 0;
    }

    .filters-card {
      margin-bottom: 2rem;
    }

    .filters-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 1rem;
      align-items: end;
    }

    .search-field,
    .category-filter,
    .status-filter,
    .featured-filter {
      width: 100%;
    }

    .table-card {
      margin-bottom: 2rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .products-table {
      width: 100%;
    }

    .product-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-thumbnail {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      object-fit: cover;
    }

    .no-image {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }

    .product-name {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .product-title {
      font-weight: 500;
      color: #333;
    }

    .product-slug {
      font-size: 0.8rem;
      color: #666;
      font-family: monospace;
    }

    .product-price {
      font-weight: 600;
      color: #1976d2;
    }

    .no-category {
      color: #999;
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #999;
    }

    .no-data mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
    }

    .no-data p {
      font-size: 1.1rem;
      margin: 0;
    }

    @media (max-width: 1200px) {
      .filters-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .filters-row {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  displayedColumns: string[] = ['id', 'image', 'name', 'category', 'price', 'isActive', 'isFeatured', 'sortOrder', 'actions'];
  
  // Filters
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  selectedFeatured: string = '';
  
  // Pagination
  pageSize: number = 10;
  totalProducts: number = 0;
  currentPage: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      const [products, categories] = await Promise.all([
        this.apiService.getProducts().toPromise(),
        this.apiService.getCategories().toPromise()
      ]);

      this.products = products || [];
      this.categories = categories || [];
      this.totalProducts = this.products.length;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading data:', error);
      this.showNotification('Error loading data', 'error');
    }
  }

  applyFilters() {
    let filtered = [...this.products];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(search) ||
        product.slug?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category?.id === +this.selectedCategory);
    }

    // Status filter
    if (this.selectedStatus !== '') {
      const isActive = this.selectedStatus === 'true';
      filtered = filtered.filter(product => product.isActive === isActive);
    }

    // Featured filter
    if (this.selectedFeatured !== '') {
      const isFeatured = this.selectedFeatured === 'true';
      filtered = filtered.filter(product => product.isFeatured === isFeatured);
    }

    this.filteredProducts = filtered;
    this.totalProducts = filtered.length;
    this.currentPage = 0;
  }

  sortData(sort: Sort) {
    const data = [...this.filteredProducts];
    if (!sort.active || sort.direction === '') {
      this.filteredProducts = data;
      return;
    }

    this.filteredProducts = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'sortOrder': return this.compare(a.sortOrder, b.sortOrder, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openProductForm(product?: any) {
    if (product) {
      this.router.navigate(['/admin/products/edit', product.id]);
    } else {
      this.router.navigate(['/admin/products/create']);
    }
  }

  editProduct(product: any) {
    this.openProductForm(product);
  }

  async deleteProduct(product: any) {
    if (confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      try {
        await this.apiService.deleteProduct(product.id).toPromise();
        this.showNotification('Product deleted successfully', 'success');
        this.loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
        this.showNotification('Error deleting product', 'error');
      }
    }
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}


