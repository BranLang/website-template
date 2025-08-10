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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-categories',
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
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="admin-categories-container">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>{{ 'ADMIN.CATEGORIES.TITLE' | translate }}</h1>
            <p>{{ 'ADMIN.CATEGORIES.SUBTITLE' | translate }}</p>
          </div>
          <button mat-raised-button color="primary" (click)="openCategoryForm()">
            <mat-icon>add</mat-icon>
            {{ 'ADMIN.CATEGORIES.ADD_NEW' | translate }}
          </button>
        </div>

        <!-- Filters and Search -->
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>{{ 'ADMIN.CATEGORIES.SEARCH' | translate }}</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="{{ 'ADMIN.CATEGORIES.SEARCH_PLACEHOLDER' | translate }}">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="type-filter">
                <mat-label>{{ 'ADMIN.CATEGORIES.TYPE_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.CATEGORIES.ALL_TYPES' | translate }}</mat-option>
                  <mat-option value="product">{{ 'ADMIN.CATEGORIES.PRODUCT_TYPE' | translate }}</mat-option>
                  <mat-option value="page">{{ 'ADMIN.CATEGORIES.PAGE_TYPE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="status-filter">
                <mat-label>{{ 'ADMIN.CATEGORIES.STATUS_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.CATEGORIES.ALL_STATUSES' | translate }}</mat-option>
                  <mat-option value="true">{{ 'ADMIN.CATEGORIES.ACTIVE' | translate }}</mat-option>
                  <mat-option value="false">{{ 'ADMIN.CATEGORIES.INACTIVE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Categories Table -->
        <mat-card class="table-card">
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="filteredCategories" matSort (matSortChange)="sortData($event)" class="categories-table">
                <!-- ID Column -->
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.CATEGORIES.ID' | translate }} </th>
                  <td mat-cell *matCellDef="let category"> {{ category.id }} </td>
                </ng-container>

                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.CATEGORIES.NAME' | translate }} </th>
                  <td mat-cell *matCellDef="let category"> 
                    <div class="category-name">
                      <img *ngIf="category.imageUrl" [src]="category.imageUrl" [alt]="category.name" class="category-image">
                      <span>{{ category.name || 'N/A' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Slug Column -->
                <ng-container matColumnDef="slug">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.CATEGORIES.SLUG' | translate }} </th>
                  <td mat-cell *matCellDef="let category"> {{ category.slug || 'N/A' }} </td>
                </ng-container>

                <!-- Type Column -->
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.CATEGORIES.TYPE' | translate }} </th>
                  <td mat-cell *matCellDef="let category"> 
                    <mat-chip [color]="getTypeColor(category.type)" selected>
                      {{ category.type || 'N/A' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.CATEGORIES.STATUS' | translate }} </th>
                  <td mat-cell *matCellDef="let category"> 
                    <mat-chip [color]="category.isActive ? 'primary' : 'warn'" selected>
                      {{ category.isActive ? ('ADMIN.CATEGORIES.ACTIVE' | translate) : ('ADMIN.CATEGORIES.INACTIVE' | translate) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Sort Order Column -->
                <ng-container matColumnDef="sortOrder">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.CATEGORIES.SORT_ORDER' | translate }} </th>
                  <td mat-cell *matCellDef="let category"> {{ category.sortOrder || 0 }} </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> {{ 'ADMIN.CATEGORIES.ACTIONS' | translate }} </th>
                  <td mat-cell *matCellDef="let category"> 
                    <div class="action-buttons">
                      <button mat-icon-button matTooltip="{{ 'ADMIN.CATEGORIES.EDIT' | translate }}" (click)="editCategory(category)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button matTooltip="{{ 'ADMIN.CATEGORIES.DELETE' | translate }}" (click)="deleteCategory(category)" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <!-- No Data Message -->
              <div *ngIf="filteredCategories.length === 0" class="no-data">
                <mat-icon>category</mat-icon>
                <p>{{ 'ADMIN.CATEGORIES.NO_CATEGORIES' | translate }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <mat-paginator 
              [length]="totalCategories"
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
    .admin-categories-container {
      padding: 80px 0;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .container {
      max-width: 1200px;
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
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1rem;
      align-items: end;
    }

    .search-field {
      width: 100%;
    }

    .type-filter,
    .status-filter {
      width: 100%;
    }

    .table-card {
      margin-bottom: 2rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .categories-table {
      width: 100%;
    }

    .category-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .category-image {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
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
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'slug', 'type', 'isActive', 'sortOrder', 'actions'];
  
  // Filters
  searchTerm: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  
  // Pagination
  pageSize: number = 10;
  totalCategories: number = 0;
  currentPage: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories = await this.apiService.getCategories().toPromise() || [];
      this.totalCategories = this.categories.length;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading categories:', error);
      this.showNotification('Error loading categories', 'error');
    }
  }

  applyFilters() {
    let filtered = [...this.categories];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(category => 
        category.name?.toLowerCase().includes(search) ||
        category.slug?.toLowerCase().includes(search)
      );
    }

    // Type filter
    if (this.selectedType) {
      filtered = filtered.filter(category => category.type === this.selectedType);
    }

    // Status filter
    if (this.selectedStatus !== '') {
      const isActive = this.selectedStatus === 'true';
      filtered = filtered.filter(category => category.isActive === isActive);
    }

    this.filteredCategories = filtered;
    this.totalCategories = filtered.length;
    this.currentPage = 0;
  }

  sortData(sort: Sort) {
    const data = [...this.filteredCategories];
    if (!sort.active || sort.direction === '') {
      this.filteredCategories = data;
      return;
    }

    this.filteredCategories = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'slug': return this.compare(a.slug, b.slug, isAsc);
        case 'type': return this.compare(a.type, b.type, isAsc);
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

  getTypeColor(type: string): string {
    switch (type) {
      case 'product': return 'primary';
      case 'page': return 'accent';
      default: return 'primary';
    }
  }

  openCategoryForm(category?: any) {
    if (category) {
      this.router.navigate(['/admin/categories/edit', category.id]);
    } else {
      this.router.navigate(['/admin/categories/create']);
    }
  }

  editCategory(category: any) {
    this.openCategoryForm(category);
  }

  async deleteCategory(category: any) {
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      try {
        await this.apiService.deleteCategory(category.id).toPromise();
        this.showNotification('Category deleted successfully', 'success');
        this.loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        this.showNotification('Error deleting category', 'error');
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


