import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://localhost:7052/api/Auth';
  private readonly storageKeys = ['token', 'username', 'role', 'userId', 'email'] as const;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('email', response.email);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  logout(): void {
    this.clearSession();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.clearSession();
      return false;
    }

    return true;
  }

  getUsername(): string {
    return this.isLoggedIn() ? localStorage.getItem('username') || '' : '';
  }

  getRole(): string {
    return this.isLoggedIn() ? localStorage.getItem('role') || '' : '';
  }

  getUserId(): number | null {
    const rawUserId = this.isLoggedIn() ? localStorage.getItem('userId') : null;
    return rawUserId ? Number(rawUserId) : null;
  }

  getEmail(): string {
    return this.isLoggedIn() ? localStorage.getItem('email') || '' : '';
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.getRole() === 'Admin';
  }

  private clearSession(): void {
    for (const key of this.storageKeys) {
      localStorage.removeItem(key);
    }
  }
}
