import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
      { path: 'activites', loadComponent: () => import('./features/activites/activites.component').then((m) => m.ActivitesComponent) },
      { path: 'catalogue', loadComponent: () => import('./features/catalogue/catalogue.component').then((m) => m.CatalogueComponent) },
      { path: 'mes-ingredients', loadComponent: () => import('./features/mes-ingredients/mes-ingredients.component').then((m) => m.MesIngredientsComponent) },
      { path: 'stock', loadComponent: () => import('./features/stock/stock.component').then((m) => m.StockComponent) },
      { path: 'labo-stock', loadComponent: () => import('./features/labo-stock/labo-stock.component').then((m) => m.LaboStockComponent) },
      { path: 'inventaire', loadComponent: () => import('./features/inventaire/inventaire.component').then((m) => m.InventaireComponent) },
      { path: 'transfers', loadComponent: () => import('./features/transfers/transfers.component').then((m) => m.TransfersComponent) },
      { path: 'transfer-history', loadComponent: () => import('./features/transfer-history/transfer-history.component').then((m) => m.TransferHistoryComponent) },
      { path: 'products', loadComponent: () => import('./features/products/products.component').then((m) => m.ProductsComponent) },
      { path: 'technical-sheets', loadComponent: () => import('./features/technical-sheets/technical-sheets.component').then((m) => m.TechnicalSheetsComponent) },
      { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent) },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
