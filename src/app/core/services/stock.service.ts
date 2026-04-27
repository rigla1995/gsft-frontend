import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IngredientAssignation,
  InventaireSession,
  Mouvement,
  MouvementFilter,
  MouvementRequest,
  StockItem,
  Transfert,
  TransfertFilter,
  TransfertRequest,
} from '../models/stock.model';
import { PaginatedResponse } from '../models/catalogue.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);

  // Stock items per activity
  getStock(activiteId: string): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`/api/activities/${activiteId}/stock`);
  }

  // Ingredient assignment
  getAssignedIngredients(activiteId: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/activities/${activiteId}/ingredients`);
  }
  assignIngredients(req: IngredientAssignation): Observable<void> {
    const requests = req.ingredientIds.map(id =>
      this.http.post<void>(`/api/activities/${req.activiteId}/ingredients`, { ingredientId: id })
    );
    if (!requests.length) return of(void 0);
    return forkJoin(requests).pipe(map(() => void 0));
  }

  // Mouvements
  getMouvements(
    activiteId: string,
    filter?: MouvementFilter,
  ): Observable<PaginatedResponse<Mouvement>> {
    let params = new HttpParams();
    if (filter?.ingredientId) params = params.set('ingredientId', filter.ingredientId);
    if (filter?.type) params = params.set('type', filter.type);
    if (filter?.dateDebut) params = params.set('dateDebut', filter.dateDebut);
    if (filter?.dateFin) params = params.set('dateFin', filter.dateFin);
    if (filter?.page != null) params = params.set('page', String(filter.page));
    if (filter?.pageSize != null) params = params.set('pageSize', String(filter.pageSize));
    return this.http.get<PaginatedResponse<Mouvement>>(
      `/api/activities/${activiteId}/stock/movements`,
      { params },
    );
  }

  enregistrerMouvement(activiteId: string, req: MouvementRequest): Observable<Mouvement> {
    return this.http.post<Mouvement>(`/api/activities/${activiteId}/stock/movements`, req);
  }

  // Transferts
  transferer(req: TransfertRequest): Observable<void> {
    return this.http.post<void>('/api/transfers', req);
  }

  getTransferts(filter?: TransfertFilter): Observable<PaginatedResponse<Transfert>> {
    let params = new HttpParams();
    if (filter?.activiteId) params = params.set('activiteId', filter.activiteId);
    if (filter?.ingredientId) params = params.set('ingredientId', filter.ingredientId);
    if (filter?.dateDebut) params = params.set('dateDebut', filter.dateDebut);
    if (filter?.dateFin) params = params.set('dateFin', filter.dateFin);
    if (filter?.page != null) params = params.set('page', String(filter.page));
    if (filter?.pageSize != null) params = params.set('pageSize', String(filter.pageSize));
    return this.http.get<PaginatedResponse<Transfert>>('/api/transfers', { params });
  }

  // Inventaire
  createInventaireSession(activiteId: string): Observable<InventaireSession> {
    return this.http.post<InventaireSession>(`/api/activities/${activiteId}/inventory-sessions`, {});
  }

  getInventaireSession(activityId: string, sessionId: string): Observable<InventaireSession> {
    return this.http.get<InventaireSession>(`/api/activities/${activityId}/inventory-sessions/${sessionId}`);
  }

  updateInventaireLigne(
    activityId: string,
    sessionId: string,
    ligneId: string,
    quantiteReelle: number,
  ): Observable<void> {
    return this.http.patch<void>(
      `/api/activities/${activityId}/inventory-sessions/${sessionId}/lines/${ligneId}`,
      { quantiteReelle },
    );
  }

  validerInventaire(activityId: string, sessionId: string): Observable<void> {
    return this.http.post<void>(
      `/api/activities/${activityId}/inventory-sessions/${sessionId}/validate`,
      {},
    );
  }

  getInventaires(activiteId: string): Observable<InventaireSession[]> {
    return this.http.get<InventaireSession[]>(`/api/activities/${activiteId}/inventory-sessions`);
  }
}
