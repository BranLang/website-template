import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  getProductBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/slug/${slug}`);
  }

  getFeaturedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/featured`);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/category/${categoryId}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${id}`);
  }

  // Categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  getCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories/${id}`);
  }

  getCategoryBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories/slug/${slug}`);
  }

  getCategoriesByType(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/type/${type}`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/categories/${id}`);
  }

  // Pages
  getPages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pages`);
  }

  getPage(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pages/${id}`);
  }

  getPageBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pages/slug/${slug}`);
  }

  getPagesByType(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pages/type/${type}`);
  }

  createPage(page: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pages`, page);
  }

  updatePage(id: number, page: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/pages/${id}`, page);
  }

  deletePage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/pages/${id}`);
  }

  // Orders
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  getOrder(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`);
  }

  createOrder(order: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, order);
  }

  updateOrder(id: number, order: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/orders/${id}`, order);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/orders/${id}/status`, { status });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/orders/${id}`);
  }

  // Users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  // Media
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/media/upload`, formData);
  }

  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/media`);
  }

  deleteFile(filename: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/media/${filename}`);
  }
}
