import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Language } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth endpoints
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  // Products endpoints
  getProducts(language: Language = 'sk'): Observable<any[]> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any[]>(`${this.apiUrl}/products`, { params });
  }

  getFeaturedProducts(language: Language = 'sk'): Observable<any[]> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any[]>(`${this.apiUrl}/products/featured`, { params });
  }

  getProduct(id: number, language: Language = 'sk'): Observable<any> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any>(`${this.apiUrl}/products/${id}`, { params });
  }

  getProductBySlug(slug: string, language: Language = 'sk'): Observable<any> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any>(`${this.apiUrl}/products/slug/${slug}`, { params });
  }

  getProductsByCategory(categoryId: number, language: Language = 'sk'): Observable<any[]> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any[]>(`${this.apiUrl}/products/category/${categoryId}`, { params });
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, productData);
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/products/${id}`, productData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // Categories endpoints
  getCategories(language: Language = 'sk'): Observable<any[]> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any[]>(`${this.apiUrl}/categories`, { params });
  }

  getCategory(id: number, language: Language = 'sk'): Observable<any> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any>(`${this.apiUrl}/categories/${id}`, { params });
  }

  getCategoryBySlug(slug: string, language: Language = 'sk'): Observable<any> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any>(`${this.apiUrl}/categories/slug/${slug}`, { params });
  }

  getCategoriesByType(type: string, language: Language = 'sk'): Observable<any[]> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any[]>(`${this.apiUrl}/categories/type/${type}`, { params });
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, categoryData);
  }

  updateCategory(id: number, categoryData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/categories/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  // Pages endpoints
  getPages(language: Language = 'sk'): Observable<any[]> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any[]>(`${this.apiUrl}/pages`, { params });
  }

  getPage(id: number, language: Language = 'sk'): Observable<any> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any>(`${this.apiUrl}/pages/${id}`, { params });
  }

  getPageBySlug(slug: string, language: Language = 'sk'): Observable<any> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any>(`${this.apiUrl}/pages/slug/${slug}`, { params });
  }

  getPagesByType(type: string, language: Language = 'sk'): Observable<any[]> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any[]>(`${this.apiUrl}/pages/type/${type}`, { params });
  }

  createPage(pageData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pages`, pageData);
  }

  updatePage(id: number, pageData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/pages/${id}`, pageData);
  }

  deletePage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pages/${id}`);
  }

  // Orders endpoints
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  getOrder(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, orderData);
  }

  updateOrder(id: number, orderData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${id}`, orderData);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${id}/status`, { status });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`);
  }

  // Media endpoints
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/media/upload`, formData);
  }

  getAllFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/media`);
  }

  deleteFile(filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/media/${filename}`);
  }

  // Users endpoints (admin only)
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // Seeder endpoint
  seedDatabase(): Observable<any> {
    return this.http.post(`${this.apiUrl}/seeder/seed`, {});
  }

  // Sites endpoints
  getSiteBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sites/slug/${slug}`);
  }
}
