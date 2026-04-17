import { Injectable } from '@angular/core';
import {getCookie, removeCookie, setCookie} from 'typescript-cookie';
import  {JwtPayload, jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  private readonly TOKEN_KEY = 'token';
  private readonly REFRESH_TOKEN_KEY = 'refresh-token';

  saveToken(token: string) {
    this.setCookie(this.TOKEN_KEY, token, 1);
  }

  getToken() {
    return getCookie(this.TOKEN_KEY);
  }

  removeToken() {
    removeCookie(this.TOKEN_KEY);
  }

  saveRefreshToken(refreshToken: string) {
    this.setCookie(this.REFRESH_TOKEN_KEY, refreshToken, 1);
  }

  getRefreshToken() {
    return getCookie(this.REFRESH_TOKEN_KEY);
  }

  removeRefreshToken() {
    removeCookie(this.REFRESH_TOKEN_KEY);
  }

  isValidToken() {
    return this.decodeToken(this.getToken());
  }

  isValidRefreshToken() {
    return this.decodeToken(this.getRefreshToken());
  }

  private decodeToken(token: string | undefined) {
    if (!token) {
      return false;
    }
    try {
      const decodeToken = jwtDecode<JwtPayload>(token);
      if (!decodeToken?.exp) return false;

      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);

      return tokenDate.getTime() > new Date().getTime();
    } catch {
      return false;
    }
  }

  private setCookie(key: string, value: string, days = 7) {
    setCookie(key, value, {
      expires: days,
      path: '/',
      secure: true,
      sameSite: 'Strict',
    })
  }
}
