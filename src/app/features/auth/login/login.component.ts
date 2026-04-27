import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="login-header">
            <div class="login-logo">GSFT</div>
            <h2>{{ 'AUTH.LOGIN' | translate }}</h2>
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'AUTH.EMAIL' | translate }}</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" />
              <mat-icon matSuffix>email</mat-icon>
              @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
                <mat-error>{{ 'AUTH.ERROR_REQUIRED' | translate }}</mat-error>
              }
              @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
                <mat-error>{{ 'AUTH.ERROR_EMAIL' | translate }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'AUTH.PASSWORD' | translate }}</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" autocomplete="current-password" />
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
                <mat-error>{{ 'AUTH.ERROR_REQUIRED' | translate }}</mat-error>
              }
            </mat-form-field>

            @if (errorMessage) {
              <div class="error-banner">{{ errorMessage }}</div>
            }

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="full-width submit-btn"
              [disabled]="loading"
            >
              @if (loading) {
                <mat-spinner diameter="20" />
              } @else {
                {{ 'AUTH.SUBMIT' | translate }}
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
    }
    .login-card {
      width: 400px;
      padding: 16px;
      border-radius: 12px;
    }
    .login-header {
      width: 100%;
      text-align: center;
      margin-bottom: 8px;
    }
    .login-logo {
      font-size: 2rem;
      font-weight: 700;
      color: #1565C0;
      letter-spacing: 4px;
      margin-bottom: 8px;
    }
    h2 { color: #333; font-size: 1.2rem; font-weight: 500; }
    .full-width { width: 100%; }
    .submit-btn { height: 48px; margin-top: 8px; font-size: 1rem; }
    .error-banner {
      background: #fdecea;
      color: #c62828;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 0.9rem;
    }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  hidePassword = true;
  errorMessage = '';

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login({ email: this.form.value.email!, password: this.form.value.password! })
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.user.mustChangePassword) {
            this.router.navigate(['/app/change-password']);
          } else {
            this.router.navigate(['/app/dashboard']);
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err.status === 401
              ? 'Email ou mot de passe incorrect'
              : 'Une erreur est survenue. Veuillez réessayer.';
        },
      });
  }
}
