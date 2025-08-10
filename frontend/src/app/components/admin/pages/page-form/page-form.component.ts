import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-page-form',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="page-form-container">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>{{ isEditMode ? 'ADMIN.PAGES.EDIT_PAGE' : 'ADMIN.PAGES.CREATE_PAGE' | translate }}</h1>
            <p>{{ isEditMode ? 'ADMIN.PAGES.EDIT_PAGE_SUBTITLE' : 'ADMIN.PAGES.CREATE_PAGE_SUBTITLE' | translate }}</p>
          </div>
          <div class="header-actions">
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              {{ 'COMMON.BACK' | translate }}
            </button>
            <button mat-raised-button color="primary" (click)="savePage()" [disabled]="!pageForm.valid || isSaving">
              <mat-icon>save</mat-icon>
              {{ isSaving ? 'COMMON.SAVING' : 'COMMON.SAVE' | translate }}
            </button>
          </div>
        </div>

        <!-- Loading Progress -->
        <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="loading-bar"></mat-progress-bar>

        <!-- Page Form -->
        <form [formGroup]="pageForm" (ngSubmit)="savePage()">
          <div class="form-layout">
            <!-- Main Form Section -->
            <mat-card class="main-form-card">
              <mat-card-header>
                <mat-card-title>{{ 'ADMIN.PAGES.BASIC_INFO' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'ADMIN.PAGES.PAGE_TITLE' | translate }}</mat-label>
                    <input matInput formControlName="title" placeholder="{{ 'ADMIN.PAGES.PAGE_TITLE_PLACEHOLDER' | translate }}">
                    <mat-error *ngIf="pageForm.get('title')?.hasError('required')">
                      {{ 'ADMIN.PAGES.PAGE_TITLE_REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PAGES.SLUG' | translate }}</mat-label>
                    <input matInput formControlName="slug" placeholder="{{ 'ADMIN.PAGES.SLUG_PLACEHOLDER' | translate }}">
                    <mat-error *ngIf="pageForm.get('slug')?.hasError('required')">
                      {{ 'ADMIN.PAGES.SLUG_REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PAGES.TYPE' | translate }}</mat-label>
                    <mat-select formControlName="type">
                      <mat-option value="page">{{ 'ADMIN.PAGES.PAGE_TYPE' | translate }}</mat-option>
                      <mat-option value="blog">{{ 'ADMIN.PAGES.BLOG_POST' | translate }}</mat-option>
                      <mat-option value="landing">{{ 'ADMIN.PAGES.LANDING_PAGE' | translate }}</mat-option>
                    </mat-select>
                    <mat-error *ngIf="pageForm.get('type')?.hasError('required')">
                      {{ 'ADMIN.PAGES.TYPE_REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'ADMIN.PAGES.CONTENT' | translate }}</mat-label>
                    <textarea matInput formControlName="content" rows="10" placeholder="{{ 'ADMIN.PAGES.CONTENT_PLACEHOLDER' | translate }}"></textarea>
                    <mat-error *ngIf="pageForm.get('content')?.hasError('required')">
                      {{ 'ADMIN.PAGES.CONTENT_REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PAGES.SORT_ORDER' | translate }}</mat-label>
                    <input matInput type="number" formControlName="sortOrder" placeholder="{{ 'ADMIN.PAGES.SORT_ORDER_PLACEHOLDER' | translate }}" min="0">
                    <mat-error *ngIf="pageForm.get('sortOrder')?.hasError('required')">
                      {{ 'ADMIN.PAGES.SORT_ORDER_REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>

                  <div class="checkbox-field">
                    <mat-checkbox formControlName="isPublished" color="primary">
                      {{ 'ADMIN.PAGES.IS_PUBLISHED' | translate }}
                    </mat-checkbox>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- SEO Section -->
            <mat-card class="seo-card">
              <mat-card-header>
                <mat-card-title>{{ 'ADMIN.PRODUCTS.SEO_INFORMATION' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.META_TITLE' | translate }}</mat-label>
                    <input matInput formControlName="metaTitle" placeholder="{{ 'ADMIN.PRODUCTS.META_TITLE_PLACEHOLDER' | translate }}">
                    <mat-hint>{{ 'ADMIN.PRODUCTS.META_TITLE_HINT' | translate }}</mat-hint>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.META_DESCRIPTION' | translate }}</mat-label>
                    <textarea matInput formControlName="metaDescription" rows="3" placeholder="{{ 'ADMIN.PRODUCTS.META_DESCRIPTION_PLACEHOLDER' | translate }}"></textarea>
                    <mat-hint>{{ 'ADMIN.PRODUCTS.META_DESCRIPTION_HINT' | translate }}</mat-hint>
                  </mat-form-field>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Featured Image Section -->
          <mat-card class="image-card">
            <mat-card-header>
              <mat-card-title>{{ 'ADMIN.PAGES.FEATURED_IMAGE' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="image-upload-area">
                <div class="upload-zone" (click)="openImageUpload()">
                  <mat-icon>add_photo_alternate</mat-icon>
                  <p>{{ 'ADMIN.PAGES.CLICK_TO_UPLOAD' | translate }}</p>
                  <span>{{ 'ADMIN.PAGES.DRAG_AND_DROP' | translate }}</span>
                </div>
              </div>

              <div class="image-preview" *ngIf="featuredImage">
                <img [src]="featuredImage" [alt]="'Featured image'" class="preview-image">
                <div class="image-overlay">
                  <div class="image-actions">
                    <button mat-icon-button (click)="removeImage()" matTooltip="{{ 'ADMIN.PAGES.REMOVE_IMAGE' | translate }}" color="warn">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-form-container {
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

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .loading-bar {
      margin-bottom: 2rem;
    }

    .form-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .main-form-card,
    .seo-card,
    .image-card {
      margin-bottom: 2rem;
    }

    .form-row {
      margin-bottom: 1.5rem;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: calc(50% - 0.5rem);
    }

    .form-row:has(.half-width) {
      display: flex;
      gap: 1rem;
    }

    .checkbox-field {
      display: flex;
      align-items: center;
      padding-top: 1rem;
    }

    .image-upload-area {
      margin-bottom: 2rem;
    }

    .upload-zone {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background-color 0.2s;
    }

    .upload-zone:hover {
      border-color: #1976d2;
      background-color: #f5f5f5;
    }

    .upload-zone mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #999;
      margin-bottom: 1rem;
    }

    .upload-zone p {
      font-size: 1.1rem;
      color: #666;
      margin: 0 0 0.5rem 0;
    }

    .upload-zone span {
      font-size: 0.9rem;
      color: #999;
    }

    .image-preview {
      position: relative;
      max-width: 300px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .preview-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .image-overlay {
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

    .image-preview:hover .image-overlay {
      opacity: 1;
    }

    .image-actions {
      display: flex;
      gap: 0.5rem;
    }

    @media (max-width: 1200px) {
      .form-layout {
        grid-template-columns: 1fr;
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

      .form-row:has(.half-width) {
        flex-direction: column;
      }

      .half-width {
        width: 100%;
      }
    }
  `]
})
export class PageFormComponent implements OnInit, OnDestroy {
  pageForm: FormGroup;
  featuredImage: string | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  pageId?: number;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.pageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      type: ['page', Validators.required],
      sortOrder: [0, [Validators.required, Validators.min(0)]],
      isPublished: [true],
      metaTitle: [''],
      metaDescription: ['']
    });
  }

  ngOnInit() {
    this.checkEditMode();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkEditMode() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.pageId = +params['id'];
        this.loadPage();
      }
    });
  }

  private async loadPage() {
    if (!this.pageId) return;
    
    this.isLoading = true;
    try {
      const page = await this.apiService.getPage(this.pageId).toPromise();
      if (page) {
        this.pageForm.patchValue({
          title: page.title,
          slug: page.slug,
          content: page.content,
          type: page.type,
          sortOrder: page.sortOrder || 0,
          isPublished: page.isPublished,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription
        });
        
        this.featuredImage = page.featuredImage;
      }
    } catch (error) {
      console.error('Error loading page:', error);
      this.showNotification('Error loading page', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async savePage() {
    if (this.pageForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    try {
      const pageData = {
        ...this.pageForm.value,
        featuredImage: this.featuredImage
      };

      if (this.isEditMode && this.pageId) {
        await this.apiService.updatePage(this.pageId, pageData).toPromise();
        this.showNotification('Page updated successfully', 'success');
      } else {
        await this.apiService.createPage(pageData).toPromise();
        this.showNotification('Page created successfully', 'success');
      }

      this.goBack();
    } catch (error) {
      console.error('Error saving page:', error);
      this.showNotification('Error saving page', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.pageForm.controls).forEach(key => {
      const control = this.pageForm.get(key);
      control?.markAsTouched();
    });
  }

  openImageUpload() {
    // This will be implemented when we create the image upload dialog component
    this.showNotification('Image upload dialog coming soon', 'info');
  }

  removeImage() {
    this.featuredImage = null;
  }

  goBack() {
    this.router.navigate(['/admin/pages']);
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


