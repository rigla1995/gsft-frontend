import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPwd = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return newPwd && confirm && newPwd !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-change-password',
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
    <div class="change-pwd-wrapper">
      <mat-card class="change-pwd-card">
        <mat-card-header>
          <mat-card-title>{{ 'AUTH.CHANGE_PASSWORD' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'AUTH.CURRENT_PASSWORD' | translate }}</mat-label>
              <input matInput type="password" formControlName="currentPassword" />
              @if (form.get('currentPassword')?.hasError('required') && form.get('currentPassword')?.touched) {
                <mat-error>{{ 'AUTH.ERROR_REQUIRED' | translate }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'AUTH.NEW_PASSWORD' | translate }}</mat-label>
              <input matInput type="password" formControlName="newPassword" />
              @if (form.get('newPassword')?.hasError('required') && form.get('newPassword')?.touched) {
                <mat-error>{{ 'AUTH.ERROR_REQUIRED' | translate }}</mat-error>
              }
              @if (form.get('newPassword')?.hasError('minlength')) {
                <mat-error>Minimum 8 caractères</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'AUTH.CONFIRM_PASSWORD' | translate }}</mat-label>
              <input matInput type="password" formControlName="confirmPassword" />
              @if (form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched) {
                <mat-error>Les mots de passe ne correspondent pas</mat-error>
              }
            </mat-form-field>

            <button mat-flat-button color="primary" type="submit" class="full-width" [disabled]="loading">
              @if (loading) { <mat-spinner diameter="20" /> }
              @else { {{ 'COMMON.SAVE' | translate }} }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .change-pwd-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
    .change-pwd-card { width: 400px; padding: 16px; }
    .full-width { width: 100%; margin-bottom: 8px; }
  `],
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;

  form = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService
      .changePassword({
        currentPassword: this.form.value.currentPassword!,
        newPassword: this.form.value.newPassword!,
        confirmPassword: this.form.value.confirmPassword!,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Mot de passe mis à jour', 'Fermer', { duration: 3000 });
          this.router.navigate(['/app/dashboard']);
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Erreur lors du changement de mot de passe', 'Fermer', {
            duration: 4000,
            panelClass: 'snack-error',
          });
        },
      });
  }
}
