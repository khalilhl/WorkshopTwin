import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../../auth/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiAuthUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const storedUser = localStorage.getItem(this.userKey);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Appel au backend Spring Boot
    return this.http.post<AuthResponse>(`${this.apiAuthUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
    
    // Version mock (fallback si backend non disponible) :
    // return this.mockLogin(credentials);
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    // Appel au backend Spring Boot
    return this.http.post<AuthResponse>(`${this.apiAuthUrl}/register`, registerData).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Register error:', error);
        throw error;
      })
    );
    
    // Version mock (fallback si backend non disponible) :
    // return this.mockRegister(registerData);
  }

  // Mock register pour tester sans backend
  private mockRegister(registerData: RegisterRequest): Observable<AuthResponse> {
    // Simulation d'une inscription réussie
    const mockResponse: AuthResponse = {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: Math.floor(Math.random() * 1000),
        username: registerData.username,
        email: registerData.email,
        role: 'USER'
      }
    };

    return of(mockResponse).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Register error:', error);
        throw error;
      })
    );
  }

  // Mock login pour tester sans backend
  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    // Simulation d'un login réussi pour n'importe quel utilisateur
    const mockResponse: AuthResponse = {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: 1,
        username: credentials.username,
        email: credentials.username + '@example.com',
        role: 'USER'
      }
    };

    return of(mockResponse).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    // Stocker le token et l'utilisateur
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}

