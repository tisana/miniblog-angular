import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AuthInterceptor} from './auth-interceptor';
import {AuthService} from '../services/auth.service';
import {AppModule} from '../app.module';

describe('AuthInterceptor API boundary', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(),
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]});
    spyOn(TestBed.inject(AuthService), 'getAuthorizationToken').and.returnValue('Bearer test-token');
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('does not leak the token to another origin or a non-API backend path', () => {
    for (const url of ['https://example.com/api/cards', 'http://localhost:8081/management/health', 'http://localhost:8081/api-other']) {
      client.get(url).subscribe();
      const request = http.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBeFalse();
      request.flush({});
    }
  });

  it('invalidates the session when the backend rejects its token', () => {
    client.get('/api/cards').subscribe({error: () => {}});
    const request = http.expectOne('/api/cards');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush({}, {status: 401, statusText: 'Unauthorized'});
    expect(TestBed.inject(AuthService).hasToken()).toBeFalse();
    expect(TestBed.inject(AuthService).message).toContain('rejected');
  });
});

describe('Application authentication wiring', () => {
  it('registers the interceptor for actual application HttpClient requests', () => {
    TestBed.configureTestingModule({imports: [AppModule], providers: [provideHttpClientTesting()]});
    const auth = TestBed.inject(AuthService);
    const token = 'eyJhbGciOiJIUzUxMiJ9.' + btoa('{"exp":4070908800}').replace(/=/g, '') + '.signature';
    auth.setToken(token);
    TestBed.inject(HttpClient).get('/api/cards').subscribe();
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('/api/cards');
    expect(request.request.headers.get('Authorization')).toBe('Bearer ' + token);
    request.flush([]);
    http.verify();
  });
});
