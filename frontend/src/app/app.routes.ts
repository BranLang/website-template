import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'products/:slug',
        loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: 'categories/:type',
        loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./components/faq/faq.component').then(m => m.FaqComponent)
      },
      {
        path: 'realizations',
        loadComponent: () => import('./components/realizations/realizations.component').then(m => m.RealizationsComponent)
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/admin/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/admin/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'pages',
        loadComponent: () => import('./components/admin/pages/pages.component').then(m => m.PagesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/admin/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/admin/users/users.component').then(m => m.UsersComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  }
];
