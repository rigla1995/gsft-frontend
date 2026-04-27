import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TenantType = 'Independent' | 'Enterprise';

export interface TenantSummary {
  id: string;
  name: string;
  type: TenantType;
  userCount: number;
  activityCount: number;
}

export interface ClientAccount {
  tenantId: string;
  tenantName: string;
  tenantType: TenantType;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateClientAccountRequest {
  tenantName: string;
  tenantType: TenantType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GlobalActivity {
  id: string;
  name: string;
  type: string;
  tenantId: string;
  tenantName: string;
  createdAt: string;
}

export interface GlobalStockSummary {
  tenantId: string;
  tenantName: string;
  tenantType: string;
  activityId: string;
  activityName: string;
  activityType: string;
  ingredientCount: number;
  totalValueTND: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  getTenants(): Observable<TenantSummary[]> {
    return this.http.get<TenantSummary[]>('/api/admin/tenants');
  }

  getTenantUsers(tenantId: string): Observable<ClientAccount[]> {
    return this.http.get<ClientAccount[]>(`/api/admin/tenants/${tenantId}/users`);
  }

  createClientAccount(request: CreateClientAccountRequest): Observable<ClientAccount> {
    return this.http.post<ClientAccount>('/api/admin/accounts', request);
  }

  toggleUserActive(userId: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`/api/admin/users/${userId}/toggle-active`, isActive);
  }

  getAllActivities(): Observable<GlobalActivity[]> {
    return this.http.get<GlobalActivity[]>('/api/admin/activities');
  }

  getGlobalStock(): Observable<GlobalStockSummary[]> {
    return this.http.get<GlobalStockSummary[]>('/api/admin/stock');
  }
}
