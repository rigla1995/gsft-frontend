import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, TranslateModule],
  template: `
    <mat-toolbar class="navbar">
      <span class="spacer"></span>

      <button mat-button [matMenuTriggerFor]="langMenu">
        <mat-icon>language</mat-icon>
        {{ currentLang.toUpperCase() }}
      </button>
      <mat-menu #langMenu="matMenu">
        <button mat-menu-item (click)="setLang('fr')">Français</button>
        <button mat-menu-item (click)="setLang('en')">English</button>
      </mat-menu>

      <button mat-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
        {{ userDisplayName }}
      </button>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          {{ 'AUTH.LOGOUT' | translate }}
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      height: 56px;
      padding: 0 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .spacer { flex: 1; }
  `],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  get currentLang(): string {
    return this.translate.currentLang ?? 'fr';
  }

  get userDisplayName(): string {
    const user = this.authService.currentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }

  setLang(lang: string): void {
    this.translate.use(lang);
  }

  logout(): void {
    this.authService.logout();
  }
}
