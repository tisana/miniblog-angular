import {TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from './services/auth.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Mini Blog'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Mini Blog');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Mini Blog');
  });

  it('accepts an external token, clears the input, and allows clearing the session', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const token = 'eyJhbGciOiJIUzUxMiJ9.' + btoa('{"exp":4070908800}').replace(/=/g, '') + '.signature';
    const input = fixture.nativeElement.querySelector('input[name="accessToken"]');
    input.value = token;
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(TestBed.inject(AuthService).getAuthorizationToken()).toBe('Bearer ' + token);
    expect(fixture.componentInstance.tokenInput).toBe('');
    expect(fixture.nativeElement.querySelector('input[name="accessToken"]')).toBeNull();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(TestBed.inject(AuthService).getAuthorizationToken()).toBe('');
    expect(fixture.nativeElement.querySelector('input[name="accessToken"]')).not.toBeNull();
  });

  it('shows malformed token errors without opening the API view', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.componentInstance.tokenInput = 'not-a-jwt';
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('unexpired');
    expect(TestBed.inject(AuthService).hasToken()).toBeFalse();
  });
});
