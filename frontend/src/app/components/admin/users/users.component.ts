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
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-users',
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
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="admin-users-container">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>{{ 'ADMIN.USERS.TITLE' | translate }}</h1>
            <p>{{ 'ADMIN.USERS.SUBTITLE' | translate }}</p>
          </div>
          <button mat-raised-button color="primary" (click)="openUserForm()">
            <mat-icon>person_add</mat-icon>
            {{ 'ADMIN.USERS.ADD_NEW' | translate }}
          </button>
        </div>

        <!-- Filters and Search -->
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>{{ 'ADMIN.USERS.SEARCH' | translate }}</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="{{ 'ADMIN.USERS.SEARCH_PLACEHOLDER' | translate }}">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="role-filter">
                <mat-label>{{ 'ADMIN.USERS.ROLE_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedRole" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.USERS.ALL_ROLES' | translate }}</mat-option>
                  <mat-option value="admin">{{ 'ADMIN.USERS.ADMIN_ROLE' | translate }}</mat-option>
                  <mat-option value="user">{{ 'ADMIN.USERS.USER_ROLE' | translate }}</mat-option>
                  <mat-option value="moderator">{{ 'ADMIN.USERS.MODERATOR_ROLE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="status-filter">
                <mat-label>{{ 'ADMIN.USERS.STATUS_FILTER' | translate }}</mat-label>
                <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
                  <mat-option value="">{{ 'ADMIN.USERS.ALL_STATUSES' | translate }}</mat-option>
                  <mat-option value="active">{{ 'ADMIN.USERS.ACTIVE_STATUS' | translate }}</mat-option>
                  <mat-option value="inactive">{{ 'ADMIN.USERS.INACTIVE_STATUS' | translate }}</mat-option>
                  <mat-option value="suspended">{{ 'ADMIN.USERS.SUSPENDED_STATUS' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Users Table -->
        <mat-card class="table-card">
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="filteredUsers" matSort (matSortChange)="sortData($event)" class="users-table">
                <!-- Avatar Column -->
                <ng-container matColumnDef="avatar">
                  <th mat-header-cell *matHeaderCellDef> {{ 'ADMIN.USERS.AVATAR' | translate }} </th>
                  <td mat-cell *matCellDef="let user"> 
                    <div class="user-avatar">
                      <img *ngIf="user.avatar" [src]="user.avatar" [alt]="user.name" class="avatar-image">
                      <div *ngIf="!user.avatar" class="avatar-placeholder">
                        {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
                      </div>
                    </div>
                  </td>
                </ng-container>

                <!-- User Info Column -->
                <ng-container matColumnDef="userInfo">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.USERS.USER_INFO' | translate }} </th>
                  <td mat-cell *matCellDef="let user"> 
                    <div class="user-info">
                      <span class="user-name">{{ user.name || 'N/A' }}</span>
                      <span class="user-email">{{ user.email || 'N/A' }}</span>
                      <span class="user-phone">{{ user.phone || 'N/A' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Role Column -->
                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.USERS.ROLE' | translate }} </th>
                  <td mat-cell *matCellDef="let user"> 
                    <mat-chip [color]="getRoleColor(user.role)" selected>
                      {{ user.role || 'user' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.USERS.STATUS' | translate }} </th>
                  <td mat-cell *matCellDef="let user"> 
                    <mat-chip [color]="getStatusColor(user.status)" selected>
                      {{ user.status || 'active' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Last Login Column -->
                <ng-container matColumnDef="lastLogin">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.USERS.LAST_LOGIN' | translate }} </th>
                  <td mat-cell *matCellDef="let user"> 
                    <span class="last-login">{{ user.lastLoginAt ? (user.lastLoginAt | date:'short') : 'Never' }}</span>
                  </td>
                </ng-container>

                <!-- Created Date Column -->
                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'ADMIN.USERS.CREATED' | translate }} </th>
                  <td mat-cell *matCellDef="let user"> {{ user.createdAt | date:'short' }} </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> {{ 'ADMIN.USERS.ACTIONS' | translate }} </th>
                  <td mat-cell *matCellDef="let user"> 
                    <div class="action-buttons">
                      <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="{{ 'ADMIN.USERS.MORE_ACTIONS' | translate }}">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #menu="matMenu">
                        <button mat-menu-item (click)="viewUser(user)">
                          <mat-icon>visibility</mat-icon>
                          <span>{{ 'ADMIN.USERS.VIEW' | translate }}</span>
                        </button>
                        <button mat-menu-item (click)="editUser(user)">
                          <mat-icon>edit</mat-icon>
                          <span>{{ 'ADMIN.USERS.EDIT' | translate }}</span>
                        </button>
                        <button mat-menu-item (click)="toggleUserStatus(user)">
                          <mat-icon>{{ user.status === 'active' ? 'block' : 'check_circle' }}</mat-icon>
                          <span>{{ user.status === 'active' ? 'ADMIN.USERS.DEACTIVATE' : 'ADMIN.USERS.ACTIVATE' | translate }}</span>
                        </button>
                        <button mat-menu-item (click)="deleteUser(user)" class="delete-action">
                          <mat-icon>delete</mat-icon>
                          <span>{{ 'ADMIN.USERS.DELETE' | translate }}</span>
                        </button>
                      </mat-menu>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <!-- No Data Message -->
              <div *ngIf="filteredUsers.length === 0" class="no-data">
                <mat-icon>people</mat-icon>
                <p>{{ 'ADMIN.USERS.NO_USERS' | translate }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <mat-paginator 
              [length]="totalUsers"
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
    .admin-users-container {
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
    .role-filter,
    .status-filter {
      width: 100%;
    }

    .table-card {
      margin-bottom: 2rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.2rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-name {
      font-weight: 500;
      color: #333;
    }

    .user-email {
      font-size: 0.8rem;
      color: #666;
    }

    .user-phone {
      font-size: 0.8rem;
      color: #666;
    }

    .last-login {
      font-size: 0.9rem;
      color: #666;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
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
    }
  `]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  displayedColumns: string[] = ['avatar', 'userInfo', 'role', 'status', 'lastLogin', 'createdAt', 'actions'];
  
  // Filters
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';
  
  // Pagination
  pageSize: number = 10;
  totalUsers: number = 0;
  currentPage: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await this.apiService.getUsers().toPromise() || [];
      this.totalUsers = this.users.length;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading users:', error);
      this.showNotification('Error loading users', 'error');
    }
  }

  applyFilters() {
    let filtered = [...this.users];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search)
      );
    }

    // Role filter
    if (this.selectedRole) {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(user => user.status === this.selectedStatus);
    }

    this.filteredUsers = filtered;
    this.totalUsers = filtered.length;
    this.currentPage = 0;
  }

  sortData(sort: Sort) {
    const data = [...this.filteredUsers];
    if (!sort.active || sort.direction === '') {
      this.filteredUsers = data;
      return;
    }

    this.filteredUsers = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'userInfo': return this.compare(a.name, b.name, isAsc);
        case 'role': return this.compare(a.role, b.role, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'lastLogin': return this.compare(new Date(a.lastLoginAt || 0), new Date(b.lastLoginAt || 0), isAsc);
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

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'warn';
      case 'moderator': return 'accent';
      case 'user': return 'primary';
      default: return 'primary';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return '';
      case 'suspended': return 'warn';
      default: return 'primary';
    }
  }

  openUserForm(user?: any) {
    // This will be implemented when we create the user form component
    if (user) {
      this.router.navigate(['/admin/users/edit', user.id]);
    } else {
      this.router.navigate(['/admin/users/new']);
    }
  }

  viewUser(user: any) {
    this.router.navigate(['/admin/users/view', user.id]);
  }

  editUser(user: any) {
    this.openUserForm(user);
  }

  async toggleUserStatus(user: any) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = user.status === 'active' ? 'deactivate' : 'activate';
    
    if (confirm(`Are you sure you want to ${action} user ${user.name}?`)) {
      try {
        await this.apiService.updateUser(user.id, { status: newStatus }).toPromise();
        this.showNotification(`User ${action}d successfully`, 'success');
        this.loadUsers();
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        this.showNotification(`Error ${action}ing user`, 'error');
      }
    }
  }

  async deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
      try {
        await this.apiService.deleteUser(user.id).toPromise();
        this.showNotification('User deleted successfully', 'success');
        this.loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showNotification('Error deleting user', 'error');
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


