import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

// JWT sin firma válida: a TokenService solo le interesa la fecha de expiración (exp)
function buildToken(exp: number): string {
  const encode = (value: object) => btoa(JSON.stringify(value));
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ exp })}.signature`;
}

describe('TokenService', () => {
  let service: TokenService;
  const nowInSeconds = Math.floor(Date.now() / 1000);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    vi.spyOn(service, 'getToken');
    vi.spyOn(service, 'getRefreshToken');
  });

  it('should accept a token that has not expired', () => {
    vi.mocked(service.getToken).mockReturnValue(buildToken(nowInSeconds + 60));

    expect(service.isValidToken()).toBe(true);
  });

  it('should reject an expired token', () => {
    vi.mocked(service.getToken).mockReturnValue(buildToken(nowInSeconds - 60));

    expect(service.isValidToken()).toBe(false);
  });

  it('should reject a missing or malformed token', () => {
    vi.mocked(service.getToken).mockReturnValue(undefined);
    expect(service.isValidToken()).toBe(false);

    vi.mocked(service.getToken).mockReturnValue('not-a-jwt');
    expect(service.isValidToken()).toBe(false);
  });

  it('should validate the refresh token independently', () => {
    vi.mocked(service.getToken).mockReturnValue(buildToken(nowInSeconds - 60));
    vi.mocked(service.getRefreshToken).mockReturnValue(buildToken(nowInSeconds + 60));

    expect(service.isValidRefreshToken()).toBe(true);
  });
});
