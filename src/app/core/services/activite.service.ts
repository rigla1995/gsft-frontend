import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ActivityType = 'Franchise' | 'Distincte' | 'Labo';

export interface Activite {
  id: string;
  name: string;
  type: ActivityType;
  tenantId: string;
  parentActivityId?: string;
  parentActivityName?: string;
  createdAt?: string;
}

export interface CreateActiviteRequest {
  name: string;
  type: ActivityType;
  parentActivityId?: string;
}

@Injectable({ providedIn: 'root' })
export class ActiviteService {
  private http = inject(HttpClient);

  getActivites(): Observable<Activite[]> {
    return this.http.get<Activite[]>('/api/activities');
  }

  getActivite(id: string): Observable<Activite> {
    return this.http.get<Activite>(`/api/activities/${id}`);
  }

  createActivite(body: CreateActiviteRequest): Observable<Activite> {
    return this.http.post<Activite>('/api/activities', body);
  }

  updateActivite(id: string, body: CreateActiviteRequest): Observable<Activite> {
    return this.http.put<Activite>(`/api/activities/${id}`, body);
  }

  deleteActivite(id: string): Observable<void> {
    return this.http.delete<void>(`/api/activities/${id}`);
  }

  dupliquerStock(sourceId: string, destId: string): Observable<void> {
    return this.http.post<void>(`/api/activities/${sourceId}/stock/duplicate-to/${destId}`, {});
  }
}
