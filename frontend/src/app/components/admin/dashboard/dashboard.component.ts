import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="admin-dashboard-container">
      <div class="container">
        <div class="dashboard-header">
          <h1>{{ 'ADMIN.DASHBOARD.TITLE' | translate }}</h1>
          <p>{{ 'ADMIN.DASHBOARD.SUBTITLE' | translate }}</p>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon orders">
                  <mat-icon>shopping_cart</mat-icon>
                </div>
                <div class="stat-details">
                  <h3>{{ stats.totalOrders || 0 }}</h3>
                  <p>{{ 'ADMIN.DASHBOARD.TOTAL_ORDERS' | translate }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon products">
                  <mat-icon>inventory</mat-icon>
                </div>
                <div class="stat-details">
                  <h3>{{ stats.totalProducts || 0 }}</h3>
                  <p>{{ 'ADMIN.DASHBOARD.TOTAL_PRODUCTS' | translate }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon categories">
                  <mat-icon>category</mat-icon>
                </div>
                <div class="stat-details">
                  <h3>{{ stats.totalCategories || 0 }}</h3>
                  <p>{{ 'ADMIN.DASHBOARD.TOTAL_CATEGORIES' | translate }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon users">
                  <mat-icon>people</mat-icon>
                </div>
                <div class="stat-details">
                  <h3>{{ stats.totalUsers || 0 }}</h3>
                  <p>{{ 'ADMIN.DASHBOARD.TOTAL_USERS' | translate }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Recent Orders -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2>{{ 'ADMIN.DASHBOARD.RECENT_ORDERS' | translate }}</h2>
            <button mat-button color="primary" (click)="navigateToOrders()">
              {{ 'ADMIN.DASHBOARD.VIEW_ALL' | translate }}
            </button>
          </div>
          <mat-card>
            <mat-card-content>
              <div *ngIf="recentOrders.length > 0; else noOrders" class="orders-list">
                <div *ngFor="let order of recentOrders" class="order-item">
                  <div class="order-info">
                    <h4>#{{ order.id }}</h4>
                    <p>{{ order.customerName || 'N/A' }}</p>
                    <span class="order-date">{{ order.createdAt | date:'short' }}</span>
                  </div>
                  <div class="order-status">
                    <mat-chip [color]="getStatusColor(order.status)" selected>
                      {{ order.status }}
                    </mat-chip>
                  </div>
                  <div class="order-amount">
                    <strong>{{ order.totalAmount | currency:'EUR' }}</strong>
                  </div>
                </div>
              </div>
              <ng-template #noOrders>
                <p class="no-data">{{ 'ADMIN.DASHBOARD.NO_ORDERS' | translate }}</p>
              </ng-template>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <div class="dashboard-section">
          <h2>{{ 'ADMIN.DASHBOARD.QUICK_ACTIONS' | translate }}</h2>
          <div class="quick-actions-grid">
            <mat-card class="action-card" (click)="navigateToProducts()">
              <mat-card-content>
                <mat-icon>add_shopping_cart</mat-icon>
                <h3>{{ 'ADMIN.DASHBOARD.ADD_PRODUCT' | translate }}</h3>
                <p>{{ 'ADMIN.DASHBOARD.ADD_PRODUCT_DESC' | translate }}</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="action-card" (click)="navigateToCategories()">
              <mat-card-content>
                <mat-icon>add_category</mat-icon>
                <h3>{{ 'ADMIN.DASHBOARD.ADD_CATEGORY' | translate }}</h3>
                <p>{{ 'ADMIN.DASHBOARD.ADD_CATEGORY_DESC' | translate }}</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="action-card" (click)="navigateToPages()">
              <mat-card-content>
                <mat-icon>add_page</mat-icon>
                <h3>{{ 'ADMIN.DASHBOARD.ADD_PAGE' | translate }}</h3>
                <p>{{ 'ADMIN.DASHBOARD.ADD_PAGE_DESC' | translate }}</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="action-card" (click)="navigateToMedia()">
              <mat-card-content>
                <mat-icon>upload_file</mat-icon>
                <h3>{{ 'ADMIN.DASHBOARD.UPLOAD_MEDIA' | translate }}</h3>
                <p>{{ 'ADMIN.DASHBOARD.UPLOAD_MEDIA_DESC' | translate }}</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      padding: 80px 0;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.orders { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.products { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.categories { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.users { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-details h3 {
      font-size: 2rem;
      margin: 0;
      color: #333;
    }

    .stat-details p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .dashboard-section {
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .orders-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .order-info h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .order-info p {
      margin: 0 0 0.25rem 0;
      color: #666;
    }

    .order-date {
      font-size: 0.8rem;
      color: #999;
    }

    .order-amount {
      font-size: 1.1rem;
    }

    .no-data {
      text-align: center;
      color: #999;
      font-style: italic;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .action-card mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .action-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
      }

      .order-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  recentOrders: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      // Load statistics
      const [orders, products, categories, users] = await Promise.all([
        this.apiService.getOrders().toPromise(),
        this.apiService.getProducts().toPromise(),
        this.apiService.getCategories().toPromise(),
        this.apiService.getUsers().toPromise()
      ]);

      this.stats = {
        totalOrders: orders?.length || 0,
        totalProducts: products?.length || 0,
        totalCategories: categories?.length || 0,
        totalUsers: users?.length || 0
      };

      // Load recent orders (last 5)
      this.recentOrders = (orders || []).slice(0, 5);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warn';
      case 'processing': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return '';
      default: return 'primary';
    }
  }

  navigateToOrders() {
    this.router.navigate(['/admin/orders']);
  }

  navigateToProducts() {
    this.router.navigate(['/admin/products']);
  }

  navigateToCategories() {
    this.router.navigate(['/admin/categories']);
  }

  navigateToPages() {
    this.router.navigate(['/admin/pages']);
  }

  navigateToMedia() {
    this.router.navigate(['/admin/media']);
  }
}


