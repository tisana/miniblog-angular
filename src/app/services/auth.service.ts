import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  getAuthorizationToken(): string {
    // TODO implement proper auth system
    return 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTg2MTI4MjYsImV4cCI6MTYzMDE0ODgyNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXSwiYXV0aG9yaXRpZXMiOiJST0xFX1VTRVIiLCJhdXRoIjoiUk9MRV9VU0VSIn0.Qpdkc4HNE_Nixov7Xh9oC4CMjJG6aEd4P_e5Uv-xBXBNcWzchPOLpenZjeoE_5In8Q8lZnKWeqeVfsEyIhqhbA';
  }
}
