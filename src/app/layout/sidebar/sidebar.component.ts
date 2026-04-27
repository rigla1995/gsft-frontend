import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule, TranslateModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-text">GSFT</span>
      </div>
      <mat-nav-list>
        @for (item of navItems; track item.route) {
          <a mat-list-item [routerLink]="item.route" routerLinkActive="active-link">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.labelKey | translate }}</span>
          </a>
        }
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100%;
      background: #1565C0;
      display: flex;
      flex-direction: column;
    }
    .sidebar-logo {
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .logo-text {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 2px;
    }
    mat-nav-list {
      padding-top: 8px;
    }
    a[mat-list-item] {
      color: rgba(255,255,255,0.85) !important;
      border-radius: 0 24px 24px 0;
      margin-right: 12px;
      margin-bottom: 2px;
    }
    a[mat-list-item]:hover {
      background: rgba(255,255,255,0.1) !important;
    }
    .active-link {
      background: rgba(255,255,255,0.2) !important;
      color: white !important;
      font-weight: 600;
    }
    mat-icon { color: rgba(255,255,255,0.85); }
  `],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { labelKey: 'NAV.DASHBOARD', icon: 'dashboard', route: '/app/dashboard' },
    { labelKey: 'NAV.ACTIVITES', icon: 'store', route: '/app/activites' },
    { labelKey: 'NAV.CATALOGUE', icon: 'menu_book', route: '/app/catalogue' },
    { labelKey: 'NAV.STOCK', icon: 'inventory_2', route: '/app/stock' },
    { labelKey: 'NAV.LABO_STOCK', icon: 'science', route: '/app/labo-stock' },
    { labelKey: 'NAV.TRANSFERS', icon: 'swap_horiz', route: '/app/transfers' },
    { labelKey: 'NAV.TRANSFER_HISTORY', icon: 'history', route: '/app/transfer-history' },
    { labelKey: 'NAV.PRODUCTS', icon: 'fastfood', route: '/app/products' },
    { labelKey: 'NAV.TECHNICAL_SHEETS', icon: 'description', route: '/app/technical-sheets' },
  ];
}
