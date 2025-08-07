import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { PagesComponent } from './components/admin/pages/pages.component';
import { OrdersComponent } from './components/admin/orders/orders.component';
import { UsersComponent } from './components/admin/users/users.component';
import { MediaComponent } from './components/admin/media/media.component';
import { ProductFormComponent } from './components/admin/products/product-form/product-form.component';
import { CategoryFormComponent } from './components/admin/categories/category-form/category-form.component';
import { PageFormComponent } from './components/admin/pages/page-form/page-form.component';
import { UserFormComponent } from './components/admin/users/user-form/user-form.component';
import { HomeComponent } from './components/public/home/home.component';
import { ProductListComponent } from './components/public/products/product-list/product-list.component';
import { ProductDetailComponent } from './components/public/products/product-detail/product-detail.component';
import { ContactComponent } from './components/public/contact/contact.component';
import { AboutComponent } from './components/public/about/about.component';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'products/category/:categoryId', component: ProductListComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'pages/:slug', component: AboutComponent }, // Reuse AboutComponent for dynamic pages
    ]
  },
  
  // Auth routes
  { path: 'login', component: LoginComponent },
  
  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/new', component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },
      { path: 'pages', component: PagesComponent },
      { path: 'pages/new', component: PageFormComponent },
      { path: 'pages/edit/:id', component: PageFormComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },
      { path: 'media', component: MediaComponent },
    ]
  },
  
  // Catch all route
  { path: '**', redirectTo: '' }
];
