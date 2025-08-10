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
  selector: 'app-product-form',
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
    <div class="product-form-container">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>{{ isEditMode ? 'ADMIN.PRODUCTS.EDIT_PRODUCT' : 'ADMIN.PRODUCTS.CREATE_PRODUCT' | translate }}</h1>
            <p>{{ isEditMode ? 'ADMIN.PRODUCTS.EDIT_PRODUCT_SUBTITLE' : 'ADMIN.PRODUCTS.CREATE_PRODUCT_SUBTITLE' | translate }}</p>
          </div>
          <div class="header-actions">
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              {{ 'COMMON.BACK' | translate }}
            </button>
            <button mat-raised-button color="primary" (click)="saveProduct()" [disabled]="!productForm.valid || isSaving">
              <mat-icon>save</mat-icon>
              {{ isSaving ? 'COMMON.SAVING' : 'COMMON.SAVE' | translate }}
            </button>
          </div>
        </div>

        <!-- Loading Progress -->
        <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="loading-bar"></mat-progress-bar>

        <!-- Product Form -->
        <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
          <div class="form-layout">
            <!-- Main Form Section -->
            <mat-card class="main-form-card">
              <mat-card-header>
                <mat-card-title>{{ 'ADMIN.PRODUCTS.BASIC_INFORMATION' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.PRODUCT_NAME' | translate }}</mat-label>
                    <input matInput formControlName="name" placeholder="{{ 'ADMIN.PRODUCTS.PRODUCT_NAME_PLACEHOLDER' | translate }}">
                    <mat-error *ngIf="productForm.get('name')?.hasError('required')">
                      {{ 'VALIDATION.REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.SKU' | translate }}</mat-label>
                    <input matInput formControlName="sku" placeholder="{{ 'ADMIN.PRODUCTS.SKU_PLACEHOLDER' | translate }}">
                    <mat-error *ngIf="productForm.get('sku')?.hasError('required')">
                      {{ 'VALIDATION.REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.CATEGORY' | translate }}</mat-label>
                    <mat-select formControlName="categoryId">
                      <mat-option *ngFor="let category of categories" [value]="category.id">
                        {{ category.name }}
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="productForm.get('categoryId')?.hasError('required')">
                      {{ 'VALIDATION.REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.PRICE' | translate }}</mat-label>
                    <input matInput type="number" formControlName="price" placeholder="0.00" min="0" step="0.01">
                    <span matPrefix>€&nbsp;</span>
                    <mat-error *ngIf="productForm.get('price')?.hasError('required')">
                      {{ 'VALIDATION.REQUIRED' | translate }}
                    </mat-error>
                    <mat-error *ngIf="productForm.get('price')?.hasError('min')">
                      {{ 'VALIDATION.MIN_VALUE' | translate: { value: 0 } }}
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.STOCK_QUANTITY' | translate }}</mat-label>
                    <input matInput type="number" formControlName="stockQuantity" placeholder="0" min="0">
                    <mat-error *ngIf="productForm.get('stockQuantity')?.hasError('required')">
                      {{ 'VALIDATION.REQUIRED' | translate }}
                    </mat-error>
                    <mat-error *ngIf="productForm.get('stockQuantity')?.hasError('min')">
                      {{ 'VALIDATION.MIN_VALUE' | translate: { value: 0 } }}
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.SHORT_DESCRIPTION' | translate }}</mat-label>
                    <textarea matInput formControlName="shortDescription" rows="3" placeholder="{{ 'ADMIN.PRODUCTS.SHORT_DESCRIPTION_PLACEHOLDER' | translate }}"></textarea>
                    <mat-error *ngIf="productForm.get('shortDescription')?.hasError('required')">
                      {{ 'VALIDATION.REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.DESCRIPTION' | translate }}</mat-label>
                    <textarea matInput formControlName="description" rows="6" placeholder="{{ 'ADMIN.PRODUCTS.DESCRIPTION_PLACEHOLDER' | translate }}"></textarea>
                    <mat-error *ngIf="productForm.get('description')?.hasError('required')">
                      {{ 'VALIDATION.REQUIRED' | translate }}
                    </mat-error>
                  </mat-form-field>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Additional Information Section -->
            <mat-card class="additional-info-card">
              <mat-card-header>
                <mat-card-title>{{ 'ADMIN.PRODUCTS.ADDITIONAL_INFORMATION' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.WEIGHT' | translate }} (kg)</mat-label>
                    <input matInput type="number" formControlName="weight" placeholder="0.0" min="0" step="0.1">
                    <mat-error *ngIf="productForm.get('weight')?.hasError('min')">
                      {{ 'VALIDATION.MIN_VALUE' | translate: { value: 0 } }}
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.DIMENSIONS' | translate }}</mat-label>
                    <input matInput formControlName="dimensions" placeholder="L x W x H cm">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.MANUFACTURER' | translate }}</mat-label>
                    <input matInput formControlName="manufacturer" placeholder="{{ 'ADMIN.PRODUCTS.MANUFACTURER_PLACEHOLDER' | translate }}">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.MODEL' | translate }}</mat-label>
                    <input matInput formControlName="model" placeholder="{{ 'ADMIN.PRODUCTS.MODEL_PLACEHOLDER' | translate }}">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'ADMIN.PRODUCTS.TAGS' | translate }}</mat-label>
                    <input matInput formControlName="tags" placeholder="{{ 'ADMIN.PRODUCTS.TAGS_PLACEHOLDER' | translate }}">
                    <mat-hint>{{ 'ADMIN.PRODUCTS.TAGS_HINT' | translate }}</mat-hint>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-checkbox formControlName="isActive" color="primary">
                    {{ 'ADMIN.PRODUCTS.ACTIVE' | translate }}
                  </mat-checkbox>
                </div>

                <div class="form-row">
                  <mat-checkbox formControlName="isFeatured" color="primary">
                    {{ 'ADMIN.PRODUCTS.FEATURED' | translate }}
                  </mat-checkbox>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

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

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ 'ADMIN.PRODUCTS.SLUG' | translate }}</mat-label>
                  <input matInput formControlName="slug" placeholder="{{ 'ADMIN.PRODUCTS.SLUG_PLACEHOLDER' | translate }}">
                  <mat-hint>{{ 'ADMIN.PRODUCTS.SLUG_HINT' | translate }}</mat-hint>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Images Section -->
          <mat-card class="images-card">
            <mat-card-header>
              <mat-card-title>{{ 'ADMIN.PRODUCTS.PRODUCT_IMAGES' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="images-upload-area">
                <div class="upload-zone" (click)="openImageUpload()">
                  <mat-icon>add_photo_alternate</mat-icon>
                  <p>{{ 'ADMIN.PRODUCTS.CLICK_TO_UPLOAD' | translate }}</p>
                  <span>{{ 'ADMIN.PRODUCTS.DRAG_AND_DROP' | translate }}</span>
                </div>
              </div>

              <div class="images-grid" *ngIf="productImages.length > 0">
                <div *ngFor="let image of productImages; let i = index" class="image-item">
                  <img [src]="image.url" [alt]="image.alt || 'Product image'" class="product-image">
                  <div class="image-overlay">
                    <div class="image-actions">
                      <button mat-icon-button (click)="setMainImage(i)" matTooltip="{{ 'ADMIN.PRODUCTS.SET_MAIN_IMAGE' | translate }}">
                        <mat-icon>star</mat-icon>
                      </button>
                      <button mat-icon-button (click)="removeImage(i)" matTooltip="{{ 'ADMIN.PRODUCTS.REMOVE_IMAGE' | translate }}" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>
                  <div class="image-info">
                    <span class="image-name">{{ image.name }}</span>
                    <span class="image-alt">{{ image.alt || 'No alt text' }}</span>
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
    .product-form-container {
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
    .additional-info-card,
    .seo-card,
    .images-card {
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

    .images-upload-area {
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

    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .image-item {
      position: relative;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .product-image {
      width: 100%;
      height: 150px;
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

    .image-item:hover .image-overlay {
      opacity: 1;
    }

    .image-actions {
      display: flex;
      gap: 0.5rem;
    }

    .image-info {
      padding: 1rem;
    }

    .image-name {
      display: block;
      font-weight: 500;
      color: #333;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .image-alt {
      font-size: 0.8rem;
      color: #666;
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

      .images-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  categories: any[] = [];
  productImages: any[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  productId?: number;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      weight: [0, [Validators.min(0)]],
      dimensions: [''],
      manufacturer: [''],
      model: [''],
      tags: [''],
      isActive: [true],
      isFeatured: [false],
      metaTitle: [''],
      metaDescription: [''],
      slug: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
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
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  private async loadCategories() {
    try {
      this.categories = await this.apiService.getCategories().toPromise() || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      this.showNotification('Error loading categories', 'error');
    }
  }

  private async loadProduct() {
    if (!this.productId) return;
    
    this.isLoading = true;
    try {
      const product = await this.apiService.getProduct(this.productId).toPromise();
      if (product) {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          categoryId: product.categoryId,
          price: product.price,
          stockQuantity: product.stockQuantity,
          shortDescription: product.shortDescription,
          description: product.description,
          weight: product.weight,
          dimensions: product.dimensions,
          manufacturer: product.manufacturer,
          model: product.model,
          tags: product.tags,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          slug: product.slug
        });
        
        this.productImages = product.images || [];
      }
    } catch (error) {
      console.error('Error loading product:', error);
      this.showNotification('Error loading product', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async saveProduct() {
    if (this.productForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    try {
      const productData = {
        ...this.productForm.value,
        images: this.productImages
      };

      if (this.isEditMode && this.productId) {
        await this.apiService.updateProduct(this.productId, productData).toPromise();
        this.showNotification('Product updated successfully', 'success');
      } else {
        await this.apiService.createProduct(productData).toPromise();
        this.showNotification('Product created successfully', 'success');
      }

      this.goBack();
    } catch (error) {
      console.error('Error saving product:', error);
      this.showNotification('Error saving product', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  openImageUpload() {
    // This will be implemented when we create the image upload dialog component
    this.showNotification('Image upload dialog coming soon', 'info');
  }

  setMainImage(index: number) {
    if (index === 0) return; // Already main image
    
    // Move the selected image to the first position
    const image = this.productImages.splice(index, 1)[0];
    this.productImages.unshift(image);
  }

  removeImage(index: number) {
    if (confirm('Are you sure you want to remove this image?')) {
      this.productImages.splice(index, 1);
    }
  }

  goBack() {
    this.router.navigate(['/admin/products']);
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


