import {HttpContext, HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../services/token.service';
import {AuthService} from '../services/auth.service';
import {switchMap} from 'rxjs';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}



export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  if (req.context.get(CHECK_TOKEN)) {
    const isValidToken = tokenService.isValidToken();
    if (isValidToken) {
      return addToken(req, next, tokenService);
    } else {
      return updateAccessTokenAndRefreshToken(req, next, tokenService, authService);
    }
  }
  return next(req);
};

function addToken(req: HttpRequest<unknown>, next: HttpHandlerFn, tokenService: TokenService) {
  const token = tokenService.getToken();
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  return next(req);
}

function updateAccessTokenAndRefreshToken(req: HttpRequest<unknown>, next: HttpHandlerFn, tokenService: TokenService, authService: AuthService) {
  const refreshToken = tokenService.getRefreshToken();
  const isValidRefreshToken = tokenService.isValidRefreshToken();

  if (refreshToken && isValidRefreshToken) {
    return authService.refreshToken(refreshToken)
      .pipe(
        switchMap(() => addToken(req, next, tokenService))
      );
  }
  return next(req);

}
