import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {switchMap, tap} from 'rxjs';
import {TokenService} from './token.service';
import {RequestLogin} from '../models/request-login.model';
import {User} from '../models/user.model';
import {checkToken} from '../interceptors/token-interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  http = inject(HttpClient);
  tokenService = inject(TokenService);
  private _user = signal<User | null>(null);
  $user = this._user.asReadonly();
  $isAuthenticated = computed(() => !!this._user());

  login(email: string, password: string) {
    return this.http.post<RequestLogin>(`${environment.API_URL}/api/v1/auth/login`, {email, password})
      .pipe(tap(data => this.saveSession(data)));
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${environment.API_URL}/api/v1/auth/register`, {name, email, password});
  }

  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password).pipe(switchMap(() => this.login(email, password)));
  }

  isAvailable(email: string) {
    return this.http.post<{isAvailable: boolean}>(`${environment.API_URL}/api/v1/auth/is-available`, {email});
  }

  recovery(email: string) {
    return this.http.post(`${environment.API_URL}/api/v1/auth/recovery`, {email});
  }

  changePassword(token: string, password: string) {
    return this.http.post(`${environment.API_URL}/api/v1/auth/change-password`, {token, password});
  }

  refreshToken(token: string) {
    return this.http.post<RequestLogin>(`${environment.API_URL}/api/v1/auth/refresh-token`, { refreshToken: token })
      .pipe(tap(data => this.saveSession(data)));
  }

  logout() {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this._user.set(null);
  }

  private saveSession(data: RequestLogin) {
    this.tokenService.saveToken(data.access_token);
    this.tokenService.saveRefreshToken(data.refresh_token);
  }

  // ------------------------------------------------
  // PROFILE
  // ------------------------------------------------
  getProfile() {
    return this.http.get<User>(`${environment.API_URL}/api/v1/auth/profile`, { context: checkToken() })
      .pipe(tap(data => this._user.set(data)));
  }


}
