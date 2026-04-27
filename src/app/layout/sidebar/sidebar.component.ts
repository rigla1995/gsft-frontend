import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  section?: string;
}

const SUPERADMIN_NAV: NavItem[] = [
  { label: 'Tableau de bord', icon: 'dashboard', route: '/app/dashboard' },
  { label: 'Gestion des comptes', icon: 'admin_panel_settings', route: '/app/admin', section: 'Administration' },
  { label: 'Catalogue', icon: 'menu_book', route: '/app/catalogue', section: 'Paramétrage' },
];

const TENANT_NAV: NavItem[] = [
  { label: 'Tableau de bord', icon: 'dashboard', route: '/app/dashboard' },
  { label: 'Activités', icon: 'store', route: '/app/activites' },
  { label: 'Catalogue', icon: 'menu_book', route: '/app/catalogue', section: 'Référentiel' },
  { label: 'Mes Ingrédients', icon: 'checklist', route: '/app/mes-ingredients' },
  { label: 'Stock Activité', icon: 'inventory_2', route: '/app/stock', section: 'Stock' },
  { label: 'Stock Labo', icon: 'science', route: '/app/labo-stock' },
  { label: 'Transferts', icon: 'swap_horiz', route: '/app/transfers' },
  { label: 'Historique', icon: 'history', route: '/app/transfer-history' },
  { label: 'Inventaire', icon: 'fact_check', route: '/app/inventaire' },
  { label: 'Produits', icon: 'fastfood', route: '/app/products', section: 'Produits' },
  { label: 'Fiches Techniques', icon: 'description', route: '/app/technical-sheets' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-text">GSFT</span>
        @if (isSuperAdmin()) {
          <span class="role-badge">SuperAdmin</span>
        }
      </div>
      <nav class="sidebar-nav">
        @for (item of navItems(); track item.route) {
          @if (item.section) {
            <div class="nav-section">{{ item.section }}</div>
          }
          <a class="nav-item" [routerLink]="item.route" routerLinkActive="active">
            <mat-icon>{{ item.icon }}</mat-icon>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100%;
      background: #1565C0;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    .sidebar-logo {
      padding: 18px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-text {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 3px;
    }
    .role-badge {
      font-size: 0.65rem;
      font-weight: 600;
      background: rgba(255,255,255,0.2);
      color: white;
      border-radius: 8px;
      padding: 2px 7px;
      letter-spacing: 0.03em;
    }
    .sidebar-nav { padding: 8px 0; flex: 1; }
    .nav-section {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.5);
      padding: 12px 16px 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      border-radius: 0 24px 24px 0;
      margin-right: 12px;
      margin-bottom: 2px;
      transition: background 0.15s;
      font-size: 0.9rem;
      &:hover { background: rgba(255,255,255,0.1); }
      &.active { background: rgba(255,255,255,0.2); color: white; font-weight: 600; }
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: rgba(255,255,255,0.85); }
    }
    @media (max-width: 1024px) {
      .sidebar { width: 56px; }
      .nav-item span, .nav-section, .logo-text, .role-badge { display: none; }
      .nav-item { justify-content: center; margin-right: 4px; }
    }
  `],
})
export class SidebarComponent {
  private auth = inject(AuthService);

  isSuperAdmin = computed(() => this.auth.currentUser()?.role === UserRole.SuperAdmin);

  navItems = computed<NavItem[]>(() =>
    this.isSuperAdmin() ? SUPERADMIN_NAV : TENANT_NAV
  );
}
