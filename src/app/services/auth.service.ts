import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {
  private token = '';
  private expiresAt = 0;
  message = '';

  setToken(value: string): void {
    const token = value.trim().replace(/^Bearer\s+/i, '');
    const parts = token.split('.');
    try {
      if (parts.length !== 3 || parts.some(part => !/^[A-Za-z0-9_-]+$/.test(part))) {
        throw new Error('Invalid token');
      }
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
      if (typeof claims.exp !== 'number' || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) {
        throw new Error('Expired token');
      }
      this.token = token;
      this.expiresAt = claims.exp * 1000;
      this.message = '';
    } catch {
      throw new Error('Invalid or expired JWT');
    }
    // Decoding checks format/expiry only. The backend verifies signature and permissions.
  }

  hasToken(): boolean {
    if (this.token && this.expiresAt <= Date.now()) {
      this.clearToken('Your token expired. Enter a fresh JWT.');
    }
    return this.token.length > 0;
  }

  getAuthorizationToken(): string {
    return this.hasToken() ? 'Bearer ' + this.token : '';
  }

  clearToken(message = ''): void {
    this.token = '';
    this.expiresAt = 0;
    this.message = message;
  }
}
