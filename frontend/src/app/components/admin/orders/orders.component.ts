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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-orders',
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
    <div class="admin-orders-container">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>{{ 'ADMIN.ORDERS.TITLE' | translate }}</h1>
            <p>{{ 'ADMIN.ORDERS.SUBTITLE' | translate }}</p>
          </div>
          <button mat-raised-button color="primary" (click)="openOrderForm()">
            <mat-icon>add</mat-icon>
            {{ 'ADMIN.ORDERS.ADD_NEW' | translate }}
          </button>
        </div>

        <!-- Filters and Search -->
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>{{ 'ADMIN.ORDERS.SEARCH' | translate }}</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="{{ 'ADMIN.ORDERS.SEARCH_PLACEHOLDER' | translate }}">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="type-filter">
                <mat-label>{{ 'ADMIN.ORDERS.TYPE_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.ORDERS.ALL_TYPES' | translate }}</mat-option>
                  <mat-option value="inquiry">{{ 'ADMIN.ORDERS.INQUIRY_TYPE' | translate }}</mat-option>
                  <mat-option value="order">{{ 'ADMIN.ORDERS.ORDER_TYPE' | translate }}</mat-option>
                  <mat-option value="quote">{{ 'ADMIN.ORDERS.QUOTE_TYPE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="status-filter">
                <mat-label>{{ 'ADMIN.ORDERS.STATUS_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.ORDERS.ALL_STATUSES' | translate }}</mat-option>
                  <mat-option value="pending">{{ 'ADMIN.ORDERS.PENDING_STATUS' | translate }}</mat-option>
                  <mat-option value="processing">{{ 'ADMIN.ORDERS.PROCESSING_STATUS' | translate }}</mat-option>
                  <mat-option value="completed">{{ 'ADMIN.ORDERS.COMPLETED_STATUS' | translate }}</mat-option>
                  <mat-option value="cancelled">{{ 'ADMIN.ORDERS.CANCELLED_STATUS' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Orders Table -->
        <mat-card class="table-card">
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="filteredOrders" matSort (matSortChange)="sortData($event)" class="orders-table">
                <!-- ID Column -->
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.ORDERS.ID' | translate }} </th>
                  <td mat-cell *matCellDef="let order"> #{{ order.id }} </td>
                </ng-container>

                <!-- Customer Info Column -->
                <ng-container matColumnDef="customer">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.ORDERS.CUSTOMER' | translate }} </th>
                  <td mat-cell *matCellDef="let order"> 
                    <div class="customer-info">
                      <span class="customer-name">{{ order.customerName || 'N/A' }}</span>
                      <span class="customer-email">{{ order.customerEmail || 'N/A' }}</span>
                      <span class="customer-phone">{{ order.customerPhone || 'N/A' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Type Column -->
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.ORDERS.TYPE' | translate }} </th>
                  <td mat-cell *matCellDef="let order"> 
                    <mat-chip [color]="getTypeColor(order.type)" selected>
                      {{ order.type || 'N/A' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.ORDERS.STATUS' | translate }} </th>
                  <td mat-cell *matCellDef="let order"> 
                    <mat-chip [color]="getStatusColor(order.status)" selected>
                      {{ order.status || 'N/A' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Amount Column -->
                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.ORDERS.AMOUNT' | translate }} </th>
                  <td mat-cell *matCellDef="let order"> 
                    <span class="order-amount">{{ order.estimatedPrice | currency:'EUR' }}</span>
                  </td>
                </ng-container>

                <!-- Created Date Column -->
                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.ORDERS.CREATED' | translate }} </th>
                  <td mat-cell *matCellDef="let order"> {{ order.createdAt | date:'short' }} </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> {{ 'ADMIN.ORDERS.ACTIONS' | translate }} </th>
                  <td mat-cell *matCellDef="let order"> 
                    <div class="action-buttons">
                      <button mat-icon-button matTooltip="{{ 'ADMIN.ORDERS.VIEW' | translate }}" (click)="viewOrder(order)">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button mat-icon-button matTooltip="{{ 'ADMIN.ORDERS.EDIT' | translate }}" (click)="editOrder(order)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button matTooltip="{{ 'ADMIN.ORDERS.DELETE' | translate }}" (click)="deleteOrder(order)" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <!-- No Data Message -->
              <div *ngIf="filteredOrders.length === 0" class="no-data">
                <mat-icon>shopping_cart</mat-icon>
                <p>{{ 'ADMIN.ORDERS.NO_ORDERS' | translate }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <mat-paginator 
              [length]="totalOrders"
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
    .admin-orders-container {
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

    .orders-table {
      width: 100%;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .customer-name {
      font-weight: 500;
      color: #333;
    }

    .customer-email {
      font-size: 0.8rem;
      color: #666;
    }

    .customer-phone {
      font-size: 0.8rem;
      color: #666;
    }

    .order-amount {
      font-weight: 600;
      color: #1976d2;
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
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  displayedColumns: string[] = ['id', 'customer', 'type', 'status', 'amount', 'createdAt', 'actions'];
  
  // Filters
  searchTerm: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  
  // Pagination
  pageSize: number = 10;
  totalOrders: number = 0;
  currentPage: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    try {
      this.orders = await this.apiService.getOrders().toPromise() || [];
      this.totalOrders = this.orders.length;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading orders:', error);
      this.showNotification('Error loading orders', 'error');
    }
  }

  applyFilters() {
    let filtered = [...this.orders];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.customerName?.toLowerCase().includes(search) ||
        order.customerEmail?.toLowerCase().includes(search) ||
        order.customerPhone?.toLowerCase().includes(search) ||
        order.message?.toLowerCase().includes(search)
      );
    }

    // Type filter
    if (this.selectedType) {
      filtered = filtered.filter(order => order.type === this.selectedType);
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    this.filteredOrders = filtered;
    this.totalOrders = filtered.length;
    this.currentPage = 0;
  }

  sortData(sort: Sort) {
    const data = [...this.filteredOrders];
    if (!sort.active || sort.direction === '') {
      this.filteredOrders = data;
      return;
    }

    this.filteredOrders = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'customer': return this.compare(a.customerName, b.customerName, isAsc);
        case 'type': return this.compare(a.type, b.type, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'amount': return this.compare(a.estimatedPrice, b.estimatedPrice, isAsc);
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
      case 'inquiry': return 'primary';
      case 'order': return 'accent';
      case 'quote': return 'warn';
      default: return 'primary';
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

  openOrderForm(order?: any) {
    // This will be implemented when we create the order form component
    if (order) {
      this.router.navigate(['/admin/orders/edit', order.id]);
    } else {
      this.router.navigate(['/admin/orders/new']);
    }
  }

  viewOrder(order: any) {
    this.router.navigate(['/admin/orders/view', order.id]);
  }

  editOrder(order: any) {
    this.openOrderForm(order);
  }

  async deleteOrder(order: any) {
    if (confirm(`Are you sure you want to delete order #${order.id}?`)) {
      try {
        await this.apiService.deleteOrder(order.id).toPromise();
        this.showNotification('Order deleted successfully', 'success');
        this.loadOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        this.showNotification('Error deleting order', 'error');
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


