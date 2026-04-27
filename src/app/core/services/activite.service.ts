import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Activite {
  id: string;
  nom: string;
  type: 'FRANCHISE' | 'DISTINCTE' | 'LABO';
  tenantId: string;
  laboId?: string;
  labo?: Activite;
  isActive: boolean;
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

  createActivite(body: Partial<Activite>): Observable<Activite> {
    return this.http.post<Activite>('/api/activities', body);
  }

  updateActivite(id: string, body: Partial<Activite>): Observable<Activite> {
    return this.http.patch<Activite>(`/api/activities/${id}`, body);
  }

  deleteActivite(id: string): Observable<void> {
    return this.http.delete<void>(`/api/activities/${id}`);
  }

  dupliquerStock(sourceId: string, destId: string): Observable<void> {
    return this.http.post<void>(`/api/activities/${sourceId}/dupliquer-stock`, { destId });
  }
}
