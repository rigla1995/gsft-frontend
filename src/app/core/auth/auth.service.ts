import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { LoginRequest, LoginResponse, ChangePasswordRequest } from '../models';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.restoreSession();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            role: response.user.role,
            tenantId: response.user.tenantId,
            activityId: response.user.activityId,
            mustChangePassword: response.user.mustChangePassword,
          };
          this._currentUser.set(user);
        }),
      );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/change-password`, request);
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
        }),
      );
  }

  private restoreSession(): void {
    if (!this.tokenService.isTokenValid()) return;
    const token = this.tokenService.getAccessToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName ?? '',
        lastName: payload.lastName ?? '',
        role: payload.role,
        tenantId: payload.tenantId,
        activityId: payload.activityId,
        mustChangePassword: payload.mustChangePassword,
      };
      this._currentUser.set(user);
    } catch {
      this.tokenService.clearTokens();
    }
  }
}
