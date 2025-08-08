import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;
  private firebaseApp = initializeApp(environment.firebaseConfig);
  private firebaseAuth = getAuth(this.firebaseApp);

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(map(response => {
        // Store user details and jwt token in local storage
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.access_token);
        this.currentUserSubject.next(response.user);
        return response;
      }));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  logout() {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isEditor(): boolean {
    return this.hasRole('editor') || this.hasRole('admin');
  }

  loginWithGoogle(): Observable<User | null> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.firebaseAuth, provider)).pipe(
      map(result => {
        const email = result.user.email || '';
        if (email === 'branislavlang@gmail.com') {
          const user: User = {
            id: 0,
            email,
            firstName: result.user.displayName || '',
            lastName: '',
            role: 'admin'
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', 'google');
          this.currentUserSubject.next(user);
          return user;
        }
        return null;
      })
    );
  }
}
