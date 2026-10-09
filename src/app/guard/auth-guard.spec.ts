import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth-guard';
import { TokenService } from '../services/token.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  let token: string | undefined;
  const navigate = vi.fn();

  beforeEach(() => {
    token = undefined;
    navigate.mockReset();
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: { getToken: () => token } },
        { provide: Router, useValue: { navigate } },
      ],
    });
  });

  it('should redirect to login when there is no session', () => {
    token = undefined;

    expect(executeGuard(route, state)).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow access when there is a session', () => {
    token = 'a-token';

    expect(executeGuard(route, state)).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });
});
