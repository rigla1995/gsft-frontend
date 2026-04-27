import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'change-password', loadComponent: () => import('./features/auth/change-password/change-password.component').then((m) => m.ChangePasswordComponent) },

      // SuperAdmin only
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.SuperAdmin] },
      },
      {
        path: 'catalogue',
        loadComponent: () => import('./features/catalogue/catalogue.component').then((m) => m.CatalogueComponent),
      },

      // Tenant users only (SuperAdmin has no business here)
      {
        path: 'activites',
        loadComponent: () => import('./features/activites/activites.component').then((m) => m.ActivitesComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
      {
        path: 'mes-ingredients',
        loadComponent: () => import('./features/mes-ingredients/mes-ingredients.component').then((m) => m.MesIngredientsComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
      {
        path: 'stock',
        loadComponent: () => import('./features/stock/stock.component').then((m) => m.StockComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
      {
        path: 'labo-stock',
        loadComponent: () => import('./features/labo-stock/labo-stock.component').then((m) => m.LaboStockComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
      {
        path: 'inventaire',
        loadComponent: () => import('./features/inventaire/inventaire.component').then((m) => m.InventaireComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
      {
        path: 'transfers',
        loadComponent: () => import('./features/transfers/transfers.component').then((m) => m.TransfersComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
      {
        path: 'transfer-history',
        loadComponent: () => import('./features/transfer-history/transfer-history.component').then((m) => m.TransferHistoryComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component').then((m) => m.ProductsComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
      {
        path: 'technical-sheets',
        loadComponent: () => import('./features/technical-sheets/technical-sheets.component').then((m) => m.TechnicalSheetsComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.TenantAdmin, UserRole.ActivityManager, UserRole.Viewer] },
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
