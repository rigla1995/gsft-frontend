import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IngredientAssignation,
  InventaireSession,
  Mouvement,
  MouvementFilter,
  MouvementRequest,
  StockItem,
  TransfertRequest,
} from '../models/stock.model';
import { PaginatedResponse } from '../models/catalogue.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);

  // Stock items per activity
  getStock(activiteId: string): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`/api/activites/${activiteId}/stock`);
  }

  // Ingredient assignment
  getAssignedIngredients(activiteId: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/activites/${activiteId}/ingredients`);
  }
  assignIngredients(req: IngredientAssignation): Observable<void> {
    return this.http.put<void>(`/api/activites/${req.activiteId}/ingredients`, {
      ingredientIds: req.ingredientIds,
    });
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
      `/api/activites/${activiteId}/mouvements`,
      { params },
    );
  }

  enregistrerMouvement(activiteId: string, req: MouvementRequest): Observable<Mouvement> {
    return this.http.post<Mouvement>(`/api/activites/${activiteId}/mouvements`, req);
  }

  transferer(req: TransfertRequest): Observable<void> {
    return this.http.post<void>('/api/transferts', req);
  }

  // Inventaire
  createInventaireSession(activiteId: string): Observable<InventaireSession> {
    return this.http.post<InventaireSession>(`/api/activites/${activiteId}/inventaires`, {});
  }

  getInventaireSession(sessionId: string): Observable<InventaireSession> {
    return this.http.get<InventaireSession>(`/api/inventaires/${sessionId}`);
  }

  updateInventaireLigne(
    sessionId: string,
    ligneId: string,
    quantiteReelle: number,
  ): Observable<void> {
    return this.http.patch<void>(`/api/inventaires/${sessionId}/lignes/${ligneId}`, {
      quantiteReelle,
    });
  }

  validerInventaire(sessionId: string): Observable<void> {
    return this.http.post<void>(`/api/inventaires/${sessionId}/valider`, {});
  }

  getInventaires(activiteId: string): Observable<InventaireSession[]> {
    return this.http.get<InventaireSession[]>(`/api/activites/${activiteId}/inventaires`);
  }
}
