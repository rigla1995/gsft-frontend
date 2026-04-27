import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categorie, Domaine, Ingredient, IngredientFilter, PaginatedResponse, Unite } from '../models/catalogue.model';

@Injectable({ providedIn: 'root' })
export class CatalogueService {
  private http = inject(HttpClient);

  // Unités
  getUnites(): Observable<Unite[]> {
    return this.http.get<Unite[]>('/api/units');
  }
  createUnite(body: Partial<Unite>): Observable<Unite> {
    return this.http.post<Unite>('/api/units', body);
  }
  updateUnite(id: string, body: Partial<Unite>): Observable<Unite> {
    return this.http.put<Unite>(`/api/units/${id}`, body);
  }
  deleteUnite(id: string): Observable<void> {
    return this.http.delete<void>(`/api/units/${id}`);
  }

  // Domaines
  getDomaines(): Observable<Domaine[]> {
    return this.http.get<Domaine[]>('/api/domains');
  }
  createDomaine(body: Partial<Domaine>): Observable<Domaine> {
    return this.http.post<Domaine>('/api/domains', body);
  }
  updateDomaine(id: string, body: Partial<Domaine>): Observable<Domaine> {
    return this.http.put<Domaine>(`/api/domains/${id}`, body);
  }
  deleteDomaine(id: string): Observable<void> {
    return this.http.delete<void>(`/api/domains/${id}`);
  }

  // Catégories
  getCategories(domaineId?: string): Observable<Categorie[]> {
    let params = new HttpParams();
    if (domaineId) params = params.set('domaineId', domaineId);
    return this.http.get<Categorie[]>('/api/categories', { params });
  }
  createCategorie(body: Partial<Categorie>): Observable<Categorie> {
    return this.http.post<Categorie>('/api/categories', body);
  }
  updateCategorie(id: string, body: Partial<Categorie>): Observable<Categorie> {
    return this.http.put<Categorie>(`/api/categories/${id}`, body);
  }
  deleteCategorie(id: string): Observable<void> {
    return this.http.delete<void>(`/api/categories/${id}`);
  }

  // Ingrédients
  getIngredients(filter?: IngredientFilter): Observable<PaginatedResponse<Ingredient>> {
    let params = new HttpParams();
    if (filter?.search) params = params.set('search', filter.search);
    if (filter?.categorieId) params = params.set('categorieId', filter.categorieId);
    if (filter?.domaineId) params = params.set('domaineId', filter.domaineId);
    if (filter?.page != null) params = params.set('page', String(filter.page));
    if (filter?.pageSize != null) params = params.set('pageSize', String(filter.pageSize));
    return this.http.get<PaginatedResponse<Ingredient>>('/api/ingredients', { params });
  }
  getIngredient(id: string): Observable<Ingredient> {
    return this.http.get<Ingredient>(`/api/ingredients/${id}`);
  }
  createIngredient(body: Partial<Ingredient>): Observable<Ingredient> {
    return this.http.post<Ingredient>('/api/ingredients', body);
  }
  updateIngredient(id: string, body: Partial<Ingredient>): Observable<Ingredient> {
    return this.http.put<Ingredient>(`/api/ingredients/${id}`, body);
  }
  deleteIngredient(id: string): Observable<void> {
    return this.http.delete<void>(`/api/ingredients/${id}`);
  }

  getAllIngredients(): Observable<Ingredient[]> {
    return this.getIngredients({ pageSize: 10000 }).pipe(map(r => r.data));
  }
}
