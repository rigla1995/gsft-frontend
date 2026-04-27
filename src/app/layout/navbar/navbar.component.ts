import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth/auth.service';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatSelectModule, MatFormFieldModule, TranslateModule,
  ],
  template: `
    <mat-toolbar class="navbar">
      <!-- Activité courante selector -->
      @if (state.activites().length > 0) {
        <div class="activite-select-wrap">
          <mat-icon class="activite-icon">store</mat-icon>
          <mat-form-field appearance="outline" class="activite-field">
            <mat-select [value]="state.currentActiviteId()" (selectionChange)="state.setActivite($event.value)">
              @for (a of state.activites(); track a.id) {
                <mat-option [value]="a.id">{{ a.nom }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      }

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
    .activite-select-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .activite-icon { color: #1565C0; }
    .activite-field {
      width: 180px;
      margin-top: 18px;
      ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
      ::ng-deep .mat-mdc-text-field-wrapper { background: #f0f4ff; }
    }
    @media (max-width: 600px) { .activite-select-wrap { display: none; } }
  `],
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  state = inject(AppStateService);

  ngOnInit(): void {
    this.state.init();
  }

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
