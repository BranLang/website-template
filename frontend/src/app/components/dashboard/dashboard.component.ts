import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  navLinks = [
    { path: '/admin/products', label: 'Products', icon: 'store' },
    { path: '/admin/categories', label: 'Categories', icon: 'view_list' },
    { path: '/admin/pages', label: 'Pages', icon: 'description' },
    { path: '/admin/orders', label: 'Orders', icon: 'shopping_cart' },
    { path: '/admin/users', label: 'Users', icon: 'people' }
  ];
}
