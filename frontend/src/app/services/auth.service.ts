import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    const user = this.getUserFromToken();
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getToken(): string | null {
    const lsToken = localStorage.getItem('token');
    if (lsToken) return lsToken;
    const match = document.cookie.match(new RegExp('(?:^|; )jwt=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    if (!payload) return null;
    return {
      id: payload.sub,
      email: payload.email,
      firstName: '',
      lastName: '',
      role: payload.role,
    } as User;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<{ user: User; token?: string }> {
    return this.http.post<{ user: User; token?: string }>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(map(response => {
        if ((response as any).token) {
          localStorage.setItem('token', (response as any).token as string);
        }
        this.currentUserSubject.next(response.user);
        return response;
      }));
  }

  firebaseLogin(idToken: string): Observable<{ user: User; token?: string }> {
    return this.http.post<{ user: User; token?: string }>(`${this.apiUrl}/auth/firebase-login`, { idToken }, { withCredentials: true })
      .pipe(map(response => {
        if ((response as any).token) {
          localStorage.setItem('token', (response as any).token as string);
        }
        this.currentUserSubject.next(response.user);
        return response;
      }));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(map(() => {
        this.currentUserSubject.next(null);
        localStorage.removeItem('token');
      }));
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeToken(token);
    return !!payload && payload.exp * 1000 > Date.now();
  }

  hasRole(role: string): boolean {
    const user = this.getUserFromToken();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isEditor(): boolean {
    const user = this.getUserFromToken();
    return user ? user.role === 'editor' || user.role === 'admin' : false;
  }

  getGoogleLoginUrl(): string {
    const base = this.apiUrl.replace(/\/api$/, '');
    return `${base}/api/auth/google`;
  }
}
