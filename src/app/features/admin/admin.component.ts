import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService, TenantSummary, ClientAccount, GlobalActivity, GlobalStockSummary, CreateClientAccountRequest, TenantType } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule,
    MatDividerModule, MatProgressSpinnerModule, MatTabsModule, MatTooltipModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private svc = inject(AdminService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  tenants = signal<TenantSummary[]>([]);
  tenantUsers = signal<ClientAccount[]>([]);
  allActivities = signal<GlobalActivity[]>([]);
  globalStock = signal<GlobalStockSummary[]>([]);
  loading = signal(false);
  showCreateForm = signal(false);

  tenantColumns = ['name', 'type', 'userCount', 'activityCount', 'actions'];
  userColumns = ['name', 'email', 'status', 'createdAt', 'actions'];
  activityColumns = ['name', 'type', 'tenantName', 'createdAt'];
  stockColumns = ['tenantName', 'activityName', 'activityType', 'ingredientCount', 'totalValue'];

  tenantTypes: { value: TenantType; label: string }[] = [
    { value: 'Enterprise', label: 'Entreprise' },
    { value: 'Independent', label: 'Indépendant' },
  ];

  createForm = this.fb.nonNullable.group({
    tenantName: ['', [Validators.required, Validators.minLength(2)]],
    tenantType: ['Enterprise' as TenantType, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.svc.getTenants().subscribe({
      next: t => { this.tenants.set(t); this.loading.set(false); },
      error: () => { this.snackBar.open('Erreur chargement tenants', 'Fermer', { duration: 3000 }); this.loading.set(false); },
    });
    this.svc.getAllActivities().subscribe({
      next: a => this.allActivities.set(a),
      error: () => {},
    });
    this.svc.getGlobalStock().subscribe({
      next: s => this.globalStock.set(s),
      error: () => {},
    });
  }

  viewUsers(tenant: TenantSummary): void {
    this.svc.getTenantUsers(tenant.id).subscribe({
      next: u => this.tenantUsers.set(u),
      error: () => this.snackBar.open('Erreur chargement utilisateurs', 'Fermer', { duration: 3000 }),
    });
  }

  submitCreate(): void {
    if (this.createForm.invalid) return;
    const v = this.createForm.getRawValue();
    const req: CreateClientAccountRequest = {
      tenantName: v.tenantName,
      tenantType: v.tenantType,
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      password: v.password,
    };
    this.svc.createClientAccount(req).subscribe({
      next: () => {
        this.snackBar.open('Compte créé avec succès', 'OK', { duration: 3000 });
        this.showCreateForm.set(false);
        this.createForm.reset({ tenantType: 'Enterprise' });
        this.load();
      },
      error: () => this.snackBar.open('Erreur lors de la création du compte', 'Fermer', { duration: 3000 }),
    });
  }

  toggleActive(user: ClientAccount): void {
    this.svc.toggleUserActive(user.userId, !user.isActive).subscribe({
      next: () => {
        this.snackBar.open(user.isActive ? 'Compte désactivé' : 'Compte activé', 'OK', { duration: 2000 });
        this.tenantUsers.update(list => list.map(u =>
          u.userId === user.userId ? { ...u, isActive: !u.isActive } : u
        ));
      },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 }),
    });
  }

  typeLabel(type: string): string {
    return type === 'Enterprise' ? 'Entreprise' : 'Indépendant';
  }
}
