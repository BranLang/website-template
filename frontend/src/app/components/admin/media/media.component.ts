import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatGridListModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="admin-media-container">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>{{ 'ADMIN.MEDIA.TITLE' | translate }}</h1>
            <p>{{ 'ADMIN.MEDIA.SUBTITLE' | translate }}</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openUploadDialog()">
              <mat-icon>cloud_upload</mat-icon>
              {{ 'ADMIN.MEDIA.UPLOAD_FILES' | translate }}
            </button>
            <button mat-raised-button color="accent" (click)="toggleViewMode()">
              <mat-icon>{{ viewMode === 'grid' ? 'view_list' : 'grid_view' }}</mat-icon>
              {{ viewMode === 'grid' ? 'ADMIN.MEDIA.LIST_VIEW' : 'ADMIN.MEDIA.GRID_VIEW' | translate }}
            </button>
          </div>
        </div>

        <!-- Filters and Search -->
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>{{ 'ADMIN.MEDIA.SEARCH' | translate }}</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="{{ 'ADMIN.MEDIA.SEARCH_PLACEHOLDER' | translate }}">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="type-filter">
                <mat-label>{{ 'ADMIN.MEDIA.TYPE_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.MEDIA.ALL_TYPES' | translate }}</mat-option>
                  <mat-option value="image">{{ 'ADMIN.MEDIA.IMAGE_TYPE' | translate }}</mat-option>
                  <mat-option value="document">{{ 'ADMIN.MEDIA.DOCUMENT_TYPE' | translate }}</mat-option>
                  <mat-option value="video">{{ 'ADMIN.MEDIA.VIDEO_TYPE' | translate }}</mat-option>
                  <mat-option value="audio">{{ 'ADMIN.MEDIA.AUDIO_TYPE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="category-filter">
                <mat-label>{{ 'ADMIN.MEDIA.CATEGORY_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedCategory" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.MEDIA.ALL_CATEGORIES' | translate }}</mat-option>
                  <mat-option value="products">{{ 'ADMIN.MEDIA.PRODUCTS_CATEGORY' | translate }}</mat-option>
                  <mat-option value="pages">{{ 'ADMIN.MEDIA.PAGES_CATEGORY' | translate }}</mat-option>
                  <mat-option value="carousel">{{ 'ADMIN.MEDIA.CAROUSEL_CATEGORY' | translate }}</mat-option>
                  <mat-option value="general">{{ 'ADMIN.MEDIA.GENERAL_CATEGORY' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Upload Progress -->
        <mat-card *ngIf="uploadProgress > 0 && uploadProgress < 100" class="upload-progress-card">
          <mat-card-content>
            <div class="upload-progress-content">
              <div class="upload-info">
                <span>{{ 'ADMIN.MEDIA.UPLOADING' | translate }}</span>
                <span class="upload-percentage">{{ uploadProgress }}%</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Media Grid/List -->
        <mat-card class="media-card">
          <mat-card-content>
            <!-- Grid View -->
            <div *ngIf="viewMode === 'grid'" class="media-grid">
              <div *ngFor="let media of paginatedMedia" class="media-item" (click)="selectMedia(media)">
                <div class="media-preview">
                  <img *ngIf="isImage(media)" [src]="media.url" [alt]="media.name" class="media-image">
                  <div *ngIf="!isImage(media)" class="media-icon">
                    <mat-icon>{{ getMediaIcon(media.type) }}</mat-icon>
                  </div>
                  <div class="media-overlay">
                    <div class="media-actions">
                      <button mat-icon-button (click)="previewMedia(media, $event)" matTooltip="{{ 'ADMIN.MEDIA.PREVIEW' | translate }}">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button mat-icon-button (click)="downloadMedia(media, $event)" matTooltip="{{ 'ADMIN.MEDIA.DOWNLOAD' | translate }}">
                        <mat-icon>download</mat-icon>
                      </button>
                      <button mat-icon-button [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()" matTooltip="{{ 'ADMIN.MEDIA.MORE_ACTIONS' | translate }}">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #menu="matMenu">
                        <button mat-menu-item (click)="editMedia(media)">
                          <mat-icon>edit</mat-icon>
                          <span>{{ 'ADMIN.MEDIA.EDIT' | translate }}</span>
                        </button>
                        <button mat-menu-item (click)="copyMediaUrl(media)">
                          <mat-icon>link</mat-icon>
                          <span>{{ 'ADMIN.MEDIA.COPY_URL' | translate }}</span>
                        </button>
                        <button mat-menu-item (click)="deleteMedia(media)" class="delete-action">
                          <mat-icon>delete</mat-icon>
                          <span>{{ 'ADMIN.MEDIA.DELETE' | translate }}</span>
                        </button>
                      </mat-menu>
                    </div>
                  </div>
                </div>
                <div class="media-info">
                  <span class="media-name">{{ media.name }}</span>
                  <span class="media-size">{{ formatFileSize(media.size) }}</span>
                  <span class="media-type">{{ media.type }}</span>
                </div>
              </div>
            </div>

            <!-- List View -->
            <div *ngIf="viewMode === 'list'" class="media-list">
              <div *ngFor="let media of paginatedMedia" class="media-list-item" (click)="selectMedia(media)">
                <div class="media-list-preview">
                  <img *ngIf="isImage(media)" [src]="media.url" [alt]="media.name" class="media-list-image">
                  <div *ngIf="!isImage(media)" class="media-list-icon">
                    <mat-icon>{{ getMediaIcon(media.type) }}</mat-icon>
                  </div>
                </div>
                <div class="media-list-info">
                  <span class="media-list-name">{{ media.name }}</span>
                  <span class="media-list-details">
                    {{ formatFileSize(media.size) }} • {{ media.type }} • {{ media.uploadedAt | date:'short' }}
                  </span>
                </div>
                <div class="media-list-actions">
                  <button mat-icon-button (click)="previewMedia(media, $event)" matTooltip="{{ 'ADMIN.MEDIA.PREVIEW' | translate }}">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="downloadMedia(media, $event)" matTooltip="{{ 'ADMIN.MEDIA.DOWNLOAD' | translate }}">
                    <mat-icon>download</mat-icon>
                  </button>
                  <button mat-icon-button [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()" matTooltip="{{ 'ADMIN.MEDIA.MORE_ACTIONS' | translate }}">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="editMedia(media)">
                      <mat-icon>edit</mat-icon>
                      <span>{{ 'ADMIN.MEDIA.EDIT' | translate }}</span>
                    </button>
                    <button mat-menu-item (click)="copyMediaUrl(media)">
                      <mat-icon>link</mat-icon>
                      <span>{{ 'ADMIN.MEDIA.COPY_URL' | translate }}</span>
                    </button>
                    <button mat-menu-item (click)="deleteMedia(media)" class="delete-action">
                      <mat-icon>delete</mat-icon>
                      <span>{{ 'ADMIN.MEDIA.DELETE' | translate }}</span>
                    </button>
                  </mat-menu>
                </div>
              </div>
            </div>

            <!-- No Data Message -->
            <div *ngIf="filteredMedia.length === 0" class="no-data">
              <mat-icon>image</mat-icon>
              <p>{{ 'ADMIN.MEDIA.NO_MEDIA' | translate }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Pagination -->
        <mat-card *ngIf="filteredMedia.length > 0" class="pagination-card">
          <mat-card-content>
            <mat-paginator 
              [length]="totalMedia"
              [pageSize]="pageSize"
              [pageSizeOptions]="[12, 24, 48, 96]"
              (page)="onPageChange($event)"
              showFirstLastButtons>
            </mat-paginator>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-media-container {
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

    .header-actions {
      display: flex;
      gap: 1rem;
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
    .category-filter {
      width: 100%;
    }

    .upload-progress-card {
      margin-bottom: 2rem;
      background-color: #e3f2fd;
    }

    .upload-progress-content {
      padding: 1rem 0;
    }

    .upload-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .upload-percentage {
      font-weight: 600;
      color: #1976d2;
    }

    .media-card {
      margin-bottom: 2rem;
    }

    /* Grid View Styles */
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .media-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .media-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .media-preview {
      position: relative;
      height: 150px;
      overflow: hidden;
    }

    .media-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-icon {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
    }

    .media-icon mat-icon {
      font-size: 3rem;
      color: #999;
    }

    .media-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      opacity: 0;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .media-item:hover .media-overlay {
      opacity: 1;
    }

    .media-actions {
      display: flex;
      gap: 0.5rem;
    }

    .media-info {
      padding: 1rem;
    }

    .media-name {
      display: block;
      font-weight: 500;
      color: #333;
      margin-bottom: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-size,
    .media-type {
      display: block;
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    /* List View Styles */
    .media-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }

    .media-list-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: box-shadow 0.2s;
      cursor: pointer;
    }

    .media-list-item:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .media-list-preview {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .media-list-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-list-icon {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
    }

    .media-list-icon mat-icon {
      font-size: 2rem;
      color: #999;
    }

    .media-list-info {
      flex: 1;
      min-width: 0;
    }

    .media-list-name {
      display: block;
      font-weight: 500;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .media-list-details {
      font-size: 0.8rem;
      color: #666;
    }

    .media-list-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .delete-action {
      color: #f44336;
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

    .pagination-card {
      margin-bottom: 2rem;
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

      .header-actions {
        width: 100%;
        justify-content: stretch;
      }

      .filters-row {
        grid-template-columns: 1fr;
      }

      .media-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .media-list-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .media-list-actions {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class MediaComponent implements OnInit {
  media: any[] = [];
  filteredMedia: any[] = [];
  paginatedMedia: any[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  
  // Filters
  searchTerm: string = '';
  selectedType: string = '';
  selectedCategory: string = '';
  
  // Pagination
  pageSize: number = 24;
  totalMedia: number = 0;
  currentPage: number = 0;

  // Upload
  uploadProgress: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMedia();
  }

  async loadMedia() {
    try {
      this.media = await this.apiService.getMedia().toPromise() || [];
      this.totalMedia = this.media.length;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading media:', error);
      this.showNotification('Error loading media', 'error');
    }
  }

  applyFilters() {
    let filtered = [...this.media];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search)
      );
    }

    // Type filter
    if (this.selectedType) {
      filtered = filtered.filter(item => item.type === this.selectedType);
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    this.filteredMedia = filtered;
    this.totalMedia = filtered.length;
    this.currentPage = 0;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMedia = this.filteredMedia.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  isImage(media: any): boolean {
    return media.type?.startsWith('image/') || false;
  }

  getMediaIcon(type: string): string {
    if (type?.startsWith('image/')) return 'image';
    if (type?.startsWith('video/')) return 'video_library';
    if (type?.startsWith('audio/')) return 'audiotrack';
    if (type?.includes('pdf')) return 'picture_as_pdf';
    if (type?.includes('word') || type?.includes('document')) return 'description';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  openUploadDialog() {
    // This will be implemented when we create the upload dialog component
    this.showNotification('Upload dialog coming soon', 'info');
  }

  selectMedia(media: any) {
    // Handle media selection
    console.log('Selected media:', media);
  }

  previewMedia(media: any, event: Event) {
    event.stopPropagation();
    // This will be implemented when we create the preview dialog component
    this.showNotification('Preview dialog coming soon', 'info');
  }

  downloadMedia(media: any, event: Event) {
    event.stopPropagation();
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.name;
    link.click();
  }

  editMedia(media: any) {
    // This will be implemented when we create the edit dialog component
    this.showNotification('Edit dialog coming soon', 'info');
  }

  copyMediaUrl(media: any) {
    navigator.clipboard.writeText(media.url).then(() => {
      this.showNotification('Media URL copied to clipboard', 'success');
    }).catch(() => {
      this.showNotification('Failed to copy URL', 'error');
    });
  }

  async deleteMedia(media: any) {
    if (confirm(`Are you sure you want to delete "${media.name}"? This action cannot be undone.`)) {
      try {
        await this.apiService.deleteMedia(media.id).toPromise();
        this.showNotification('Media deleted successfully', 'success');
        this.loadMedia();
      } catch (error) {
        console.error('Error deleting media:', error);
        this.showNotification('Error deleting media', 'error');
      }
    }
  }

  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : 
                  type === 'error' ? ['error-snackbar'] : ['info-snackbar']
    });
  }
}


