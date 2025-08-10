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
  selector: 'app-admin-pages',
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
    <div class="admin-pages-container">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>{{ 'ADMIN.PAGES.TITLE' | translate }}</h1>
            <p>{{ 'ADMIN.PAGES.SUBTITLE' | translate }}</p>
          </div>
          <button mat-raised-button color="primary" (click)="openPageForm()">
            <mat-icon>add</mat-icon>
            {{ 'ADMIN.PAGES.ADD_NEW' | translate }}
          </button>
        </div>

        <!-- Filters and Search -->
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>{{ 'ADMIN.PAGES.SEARCH' | translate }}</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="{{ 'ADMIN.PAGES.SEARCH_PLACEHOLDER' | translate }}">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="type-filter">
                <mat-label>{{ 'ADMIN.PAGES.TYPE_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.PAGES.ALL_TYPES' | translate }}</mat-option>
                  <mat-option value="page">{{ 'ADMIN.PAGES.PAGE_TYPE' | translate }}</mat-option>
                  <mat-option value="blog">{{ 'ADMIN.PAGES.BLOG_TYPE' | translate }}</mat-option>
                  <mat-option value="faq">{{ 'ADMIN.PAGES.FAQ_TYPE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="status-filter">
                <mat-label>{{ 'ADMIN.PAGES.STATUS_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.PAGES.ALL_STATUSES' | translate }}</mat-option>
                  <mat-option value="true">{{ 'ADMIN.PAGES.PUBLISHED' | translate }}</mat-option>
                  <mat-option value="false">{{ 'ADMIN.PAGES.DRAFT' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Pages Table -->
        <mat-card class="table-card">
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="filteredPages" matSort (matSortChange)="sortData($event)" class="pages-table">
                <!-- ID Column -->
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PAGES.ID' | translate }} </th>
                  <td mat-cell *matCellDef="let page"> {{ page.id }} </td>
                </ng-container>

                <!-- Image Column -->
                <ng-container matColumnDef="image">
                  <th mat-header-cell *matHeaderCellDef> {{ 'ADMIN.PAGES.IMAGE' | translate }} </th>
                  <td mat-cell *matCellDef="let page"> 
                    <div class="page-image">
                      <img *ngIf="page.featuredImageUrl" [src]="page.featuredImageUrl" [alt]="page.title" class="page-thumbnail">
                      <div *ngIf="!page.featuredImageUrl" class="no-image">
                        <mat-icon>image</mat-icon>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <!-- Title Column -->
                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PAGES.TITLE' | translate }} </th>
                  <td mat-cell *matCellDef="let page"> 
                    <div class="page-title">
                      <span class="page-name">{{ page.title || 'N/A' }}</span>
                      <span class="page-slug">{{ page.slug || 'N/A' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Type Column -->
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PAGES.TYPE' | translate }} </th>
                  <td mat-cell *matCellDef="let page"> 
                    <mat-chip [color]="getTypeColor(page.type)" selected>
                      {{ page.type || 'N/A' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="isPublished">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PAGES.STATUS' | translate }} </th>
                  <td mat-cell *matCellDef="let page"> 
                    <mat-chip [color]="page.isPublished ? 'primary' : 'warn'" selected>
                      {{ page.isPublished ? ('ADMIN.PAGES.PUBLISHED' | translate) : ('ADMIN.PAGES.DRAFT' | translate) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Sort Order Column -->
                <ng-container matColumnDef="sortOrder">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PAGES.SORT_ORDER' | translate }} </th>
                  <td mat-cell *matCellDef="let page"> {{ page.sortOrder || 0 }} </td>
                </ng-container>

                <!-- Created Date Column -->
                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.PAGES.CREATED' | translate }} </th>
                  <td mat-cell *matCellDef="let page"> {{ page.createdAt | date:'short' }} </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> {{ 'ADMIN.PAGES.ACTIONS' | translate }} </th>
                  <td mat-cell *matCellDef="let page"> 
                    <div class="action-buttons">
                      <button mat-icon-button matTooltip="{{ 'ADMIN.PAGES.EDIT' | translate }}" (click)="editPage(page)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button matTooltip="{{ 'ADMIN.PAGES.DELETE' | translate }}" (click)="deletePage(page)" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <!-- No Data Message -->
              <div *ngIf="filteredPages.length === 0" class="no-data">
                <mat-icon>article</mat-icon>
                <p>{{ 'ADMIN.PAGES.NO_PAGES' | translate }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <mat-paginator 
              [length]="totalPages"
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
    .admin-pages-container {
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
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1rem;
      align-items: end;
    }

    .search-field,
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

    .pages-table {
      width: 100%;
    }

    .page-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-thumbnail {
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

    .page-title {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .page-name {
      font-weight: 500;
      color: #333;
    }

    .page-slug {
      font-size: 0.8rem;
      color: #666;
      font-family: monospace;
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
export class PagesComponent implements OnInit {
  pages: any[] = [];
  filteredPages: any[] = [];
  displayedColumns: string[] = ['id', 'image', 'title', 'type', 'isPublished', 'sortOrder', 'createdAt', 'actions'];
  
  // Filters
  searchTerm: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  
  // Pagination
  pageSize: number = 10;
  totalPages: number = 0;
  currentPage: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPages();
  }

  async loadPages() {
    try {
      this.pages = await this.apiService.getPages().toPromise() || [];
      this.totalPages = this.pages.length;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading pages:', error);
      this.showNotification('Error loading pages', 'error');
    }
  }

  applyFilters() {
    let filtered = [...this.pages];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(page => 
        page.title?.toLowerCase().includes(search) ||
        page.slug?.toLowerCase().includes(search) ||
        page.content?.toLowerCase().includes(search)
      );
    }

    // Type filter
    if (this.selectedType) {
      filtered = filtered.filter(page => page.type === this.selectedType);
    }

    // Status filter
    if (this.selectedStatus !== '') {
      const isPublished = this.selectedStatus === 'true';
      filtered = filtered.filter(page => page.isPublished === isPublished);
    }

    this.filteredPages = filtered;
    this.totalPages = filtered.length;
    this.currentPage = 0;
  }

  sortData(sort: Sort) {
    const data = [...this.filteredPages];
    if (!sort.active || sort.direction === '') {
      this.filteredPages = data;
      return;
    }

    this.filteredPages = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'title': return this.compare(a.title, b.title, isAsc);
        case 'type': return this.compare(a.type, b.type, isAsc);
        case 'sortOrder': return this.compare(a.sortOrder, b.sortOrder, isAsc);
        case 'createdAt': return this.compare(new Date(a.createdAt), new Date(b.createdAt), isAsc);
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
      case 'page': return 'primary';
      case 'blog': return 'accent';
      case 'faq': return 'warn';
      default: return 'primary';
    }
  }

  openPageForm(page?: any) {
    if (page) {
      this.router.navigate(['/admin/pages/edit', page.id]);
    } else {
      this.router.navigate(['/admin/pages/create']);
    }
  }

  editPage(page: any) {
    this.openPageForm(page);
  }

  async deletePage(page: any) {
    if (confirm(`Are you sure you want to delete page "${page.title}"?`)) {
      try {
        await this.apiService.deletePage(page.id).toPromise();
        this.showNotification('Page deleted successfully', 'success');
        this.loadPages();
      } catch (error) {
        console.error('Error deleting page:', error);
        this.showNotification('Error deleting page', 'error');
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


