import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie, Domaine, Ingredient, IngredientFilter, PaginatedResponse, Unite } from '../models/catalogue.model';

@Injectable({ providedIn: 'root' })
export class CatalogueService {
  private http = inject(HttpClient);

  // Unités
  getUnites(): Observable<Unite[]> {
    return this.http.get<Unite[]>('/api/unites');
  }
  createUnite(body: Partial<Unite>): Observable<Unite> {
    return this.http.post<Unite>('/api/unites', body);
  }
  updateUnite(id: string, body: Partial<Unite>): Observable<Unite> {
    return this.http.patch<Unite>(`/api/unites/${id}`, body);
  }
  deleteUnite(id: string): Observable<void> {
    return this.http.delete<void>(`/api/unites/${id}`);
  }

  // Domaines
  getDomaines(): Observable<Domaine[]> {
    return this.http.get<Domaine[]>('/api/domaines');
  }
  createDomaine(body: Partial<Domaine>): Observable<Domaine> {
    return this.http.post<Domaine>('/api/domaines', body);
  }
  updateDomaine(id: string, body: Partial<Domaine>): Observable<Domaine> {
    return this.http.patch<Domaine>(`/api/domaines/${id}`, body);
  }
  deleteDomaine(id: string): Observable<void> {
    return this.http.delete<void>(`/api/domaines/${id}`);
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
    return this.http.patch<Categorie>(`/api/categories/${id}`, body);
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
    return this.http.patch<Ingredient>(`/api/ingredients/${id}`, body);
  }
  deleteIngredient(id: string): Observable<void> {
    return this.http.delete<void>(`/api/ingredients/${id}`);
  }

  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>('/api/ingredients/all');
  }
}
