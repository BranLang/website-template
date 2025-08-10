import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-category-form',
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
    MatSliderModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="category-form-container">
      <div class="container">
        <div class="page-header">
          <h1>{{ isEditMode ? ('ADMIN.CATEGORIES.EDIT_TITLE' | translate) : ('ADMIN.CATEGORIES.CREATE_TITLE' | translate) }}</h1>
          <p>{{ isEditMode ? ('ADMIN.CATEGORIES.EDIT_SUBTITLE' | translate) : ('ADMIN.CATEGORIES.CREATE_SUBTITLE' | translate) }}</p>
        </div>

        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="category-form">
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>{{ 'ADMIN.CATEGORIES.NAME' | translate }} *</mat-label>
                  <input matInput formControlName="name" placeholder="{{ 'ADMIN.CATEGORIES.NAME_PLACEHOLDER' | translate }}">
                  <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
                    {{ 'ADMIN.CATEGORIES.NAME_REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>{{ 'ADMIN.CATEGORIES.SLUG' | translate }} *</mat-label>
                  <input matInput formControlName="slug" placeholder="{{ 'ADMIN.CATEGORIES.SLUG_PLACEHOLDER' | translate }}">
                  <mat-error *ngIf="categoryForm.get('slug')?.hasError('required')">
                    {{ 'ADMIN.CATEGORIES.SLUG_REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>{{ 'ADMIN.CATEGORIES.DESCRIPTION' | translate }}</mat-label>
                  <textarea matInput formControlName="description" rows="3" placeholder="{{ 'ADMIN.CATEGORIES.DESCRIPTION_PLACEHOLDER' | translate }}"></textarea>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>{{ 'ADMIN.CATEGORIES.TYPE' | translate }} *</mat-label>
                  <mat-select formControlName="type">
                    <mat-option value="product">{{ 'ADMIN.CATEGORIES.PRODUCT_TYPE' | translate }}</mat-option>
                    <mat-option value="page">{{ 'ADMIN.CATEGORIES.PAGE_TYPE' | translate }}</mat-option>
                  </mat-select>
                  <mat-error *ngIf="categoryForm.get('type')?.hasError('required')">
                    {{ 'ADMIN.CATEGORIES.TYPE_REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>{{ 'ADMIN.CATEGORIES.PARENT_CATEGORY' | translate }}</mat-label>
                  <mat-select formControlName="parentId">
                    <mat-option value="">{{ 'ADMIN.CATEGORIES.NO_PARENT' | translate }}</mat-option>
                    <mat-option *ngFor="let category of parentCategories" [value]="category.id">
                      {{ category.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label>{{ 'ADMIN.CATEGORIES.SORT_ORDER' | translate }}</label>
                  <mat-slider formControlName="sortOrder" min="0" max="100" step="1" class="sort-slider">
                    <input matSliderThumb>
                  </mat-slider>
                  <span class="sort-value">{{ categoryForm.get('sortOrder')?.value }}</span>
                </div>

                <div class="form-field checkbox-field">
                  <mat-checkbox formControlName="isActive" color="primary">
                    {{ 'ADMIN.CATEGORIES.IS_ACTIVE' | translate }}
                  </mat-checkbox>
                </div>
              </div>

              <!-- Image Upload Section -->
              <div class="form-row">
                <div class="image-upload-section">
                  <label>{{ 'ADMIN.CATEGORIES.IMAGE' | translate }}</label>
                  <div class="image-upload-area" (click)="fileInput.click()" [class.has-image]="imagePreview || categoryForm.get('imageUrl')?.value">
                    <div *ngIf="!imagePreview && !categoryForm.get('imageUrl')?.value" class="upload-placeholder">
                      <mat-icon>cloud_upload</mat-icon>
                      <p>{{ 'ADMIN.CATEGORIES.UPLOAD_IMAGE' | translate }}</p>
                      <span>{{ 'ADMIN.CATEGORIES.CLICK_TO_UPLOAD' | translate }}</span>
                    </div>
                    <img *ngIf="imagePreview" [src]="imagePreview" [alt]="'Preview'" class="image-preview">
                    <img *ngIf="!imagePreview && categoryForm.get('imageUrl')?.value" [src]="categoryForm.get('imageUrl')?.value" [alt]="'Current'" class="image-preview">
                  </div>
                  <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" style="display: none;">
                  
                  <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
                    <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
                    <span>{{ uploadProgress }}%</span>
                  </div>

                  <div class="image-actions" *ngIf="imagePreview || categoryForm.get('imageUrl')?.value">
                    <button type="button" mat-button color="warn" (click)="removeImage()">
                      <mat-icon>delete</mat-icon>
                      {{ 'ADMIN.CATEGORIES.REMOVE_IMAGE' | translate }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button type="button" mat-button (click)="goBack()">
                  <mat-icon>arrow_back</mat-icon>
                  {{ 'ADMIN.CATEGORIES.CANCEL' | translate }}
                </button>
                <button type="submit" mat-raised-button color="primary" [disabled]="categoryForm.invalid || isSubmitting">
                  <mat-icon *ngIf="!isSubmitting">save</mat-icon>
                  <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
                  {{ isSubmitting ? ('ADMIN.CATEGORIES.SAVING' | translate) : (isEditMode ? ('ADMIN.CATEGORIES.UPDATE' | translate) : ('ADMIN.CATEGORIES.CREATE' | translate)) }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .category-form-container {
      padding: 80px 0;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: #666;
      margin: 0;
    }

    .form-card {
      margin-bottom: 2rem;
    }

    .category-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-field {
      width: 100%;
    }

    .checkbox-field {
      display: flex;
      align-items: center;
      padding-top: 1rem;
    }

    .sort-slider {
      width: 100%;
    }

    .sort-value {
      display: block;
      text-align: center;
      margin-top: 0.5rem;
      font-weight: bold;
      color: #1976d2;
    }

    .image-upload-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .image-upload-section label {
      font-weight: 500;
      color: #333;
    }

    .image-upload-area {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-upload-area:hover {
      border-color: #1976d2;
      background-color: #f8f9fa;
    }

    .image-upload-area.has-image {
      border-style: solid;
      border-color: #1976d2;
      padding: 1rem;
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .upload-placeholder mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #999;
    }

    .upload-placeholder p {
      margin: 0;
      font-weight: 500;
      color: #666;
    }

    .upload-placeholder span {
      font-size: 0.9rem;
      color: #999;
    }

    .image-preview {
      max-width: 100%;
      max-height: 200px;
      border-radius: 4px;
      object-fit: cover;
    }

    .upload-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .upload-progress mat-progress-bar {
      flex: 1;
    }

    .image-actions {
      display: flex;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .image-upload-area {
        min-height: 150px;
        padding: 1rem;
      }
    }
  `]
})
export class CategoryFormComponent implements OnInit {
  @Input() categoryId?: number;
  
  categoryForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  parentCategories: any[] = [];
  imagePreview: string | null = null;
  uploadProgress: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      type: ['product', Validators.required],
      parentId: [''],
      sortOrder: [0],
      isActive: [true],
      imageUrl: ['']
    });
  }

  ngOnInit() {
    this.loadParentCategories();
    this.checkEditMode();
  }

  async loadParentCategories() {
    try {
      this.parentCategories = await this.apiService.getCategories().toPromise() || [];
    } catch (error) {
      console.error('Error loading parent categories:', error);
    }
  }

  checkEditMode() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.categoryId = +params['id'];
        this.isEditMode = true;
        this.loadCategory();
      }
    });
  }

  async loadCategory() {
    if (!this.categoryId) return;
    
    try {
      const category = await this.apiService.getCategory(this.categoryId).toPromise();
      if (category) {
        this.categoryForm.patchValue({
          name: category.name,
          slug: category.slug,
          description: category.description,
          type: category.type,
          parentId: category.parentId || '',
          sortOrder: category.sortOrder || 0,
          isActive: category.isActive,
          imageUrl: category.imageUrl
        });
      }
    } catch (error) {
      console.error('Error loading category:', error);
      this.showNotification('Error loading category', 'error');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  async uploadImage(file: File) {
    try {
      this.uploadProgress = 10;
      
      const result = await this.apiService.uploadFile(file).toPromise();
      
      this.uploadProgress = 100;
      this.categoryForm.patchValue({ imageUrl: result.url });
      this.imagePreview = URL.createObjectURL(file);
      
      setTimeout(() => {
        this.uploadProgress = 0;
      }, 1000);
      
      this.showNotification('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      this.uploadProgress = 0;
      this.showNotification('Error uploading image', 'error');
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.categoryForm.patchValue({ imageUrl: '' });
  }

  async onSubmit() {
    if (this.categoryForm.invalid) return;

    this.isSubmitting = true;
    
    try {
      const formData = this.categoryForm.value;
      
      if (this.isEditMode && this.categoryId) {
        await this.apiService.updateCategory(this.categoryId, formData).toPromise();
        this.showNotification('Category updated successfully', 'success');
      } else {
        await this.apiService.createCategory(formData).toPromise();
        this.showNotification('Category created successfully', 'success');
      }
      
      this.goBack();
    } catch (error) {
      console.error('Error saving category:', error);
      this.showNotification('Error saving category', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/admin/categories']);
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


