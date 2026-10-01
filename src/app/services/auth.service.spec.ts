import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

describe('AuthService external token', () => {
  const token = (exp: number) => 'eyJhbGciOiJIUzUxMiJ9.' + btoa(JSON.stringify({exp})).replace(/=/g, '') + '.signature';
  it('starts without a hardcoded token', () => {
    TestBed.configureTestingModule({providers: [provideHttpClient()]});
    expect(TestBed.inject(AuthService).getAuthorizationToken()).toBe('');
  });

  it('normalizes a supplied Bearer token and clears it without persisting it', () => {
    const auth = TestBed.inject(AuthService);
    auth.setToken('  Bearer ' + token(4070908800) + '  ');
    expect(auth.getAuthorizationToken()).toBe('Bearer ' + token(4070908800));
    auth.clearToken();
    expect(auth.getAuthorizationToken()).toBe('');
    expect(new AuthService().getAuthorizationToken()).toBe('');
  });

  it('rejects expired, malformed, and missing-expiry tokens', () => {
    const auth = TestBed.inject(AuthService);
    for (const value of [token(1), 'bad', 'a.e30.signature']) {
      expect(() => auth.setToken(value)).toThrowError();
      expect(auth.getAuthorizationToken()).toBe('');
    }
  });

  it('stops sending a token when it expires during the session', () => {
    const auth = TestBed.inject(AuthService);
    spyOn(Date, 'now').and.returnValue(1000);
    auth.setToken(token(2));
    expect(auth.hasToken()).toBeTrue();
    (Date.now as jasmine.Spy).and.returnValue(2000);
    expect(auth.getAuthorizationToken()).toBe('');
    expect(auth.message).toContain('expired');
  });
});
