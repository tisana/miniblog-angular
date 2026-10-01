import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mini Blog';
  tokenInput = '';
  tokenError = '';

  constructor(public auth: AuthService) {}

  useToken(): void {
    try {
      this.auth.setToken(this.tokenInput);
      this.tokenInput = '';
      this.tokenError = '';
    } catch {
      this.tokenError = 'Enter a valid, unexpired JWT.';
    }
  }
}
