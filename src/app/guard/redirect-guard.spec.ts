import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { redirectGuard } from './redirect-guard';
import { TokenService } from '../services/token.service';

describe('redirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => redirectGuard(...guardParameters));

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

  it('should redirect to the dashboard when there is already a session', () => {
    token = 'a-token';

    expect(executeGuard(route, state)).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should allow access to public pages without a session', () => {
    token = undefined;

    expect(executeGuard(route, state)).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });
});
