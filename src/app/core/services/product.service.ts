import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FicheTechnique, Product, RecetteLigne } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts(activiteId?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (activiteId) params = params.set('activiteId', activiteId);
    return this.http.get<Product[]>('/api/produits', { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`/api/produits/${id}`);
  }

  createProduct(body: Partial<Product>): Observable<Product> {
    return this.http.post<Product>('/api/produits', body);
  }

  updateProduct(id: string, body: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`/api/produits/${id}`, body);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`/api/produits/${id}`);
  }

  // Recette
  updateRecette(produitId: string, lignes: Partial<RecetteLigne>[]): Observable<void> {
    return this.http.put<void>(`/api/produits/${produitId}/recette`, { lignes });
  }

  // Fiche technique
  getFicheTechnique(produitId: string): Observable<FicheTechnique> {
    return this.http.get<FicheTechnique>(`/api/produits/${produitId}/fiche-technique`);
  }

  exportFicheTechniqueExcel(produitId: string): Observable<Blob> {
    return this.http.get(`/api/produits/${produitId}/fiche-technique/export`, {
      responseType: 'blob',
    });
  }

  overridePrixIngredient(
    produitId: string,
    ingredientId: string,
    prix: number | null,
  ): Observable<void> {
    return this.http.patch<void>(
      `/api/produits/${produitId}/fiche-technique/prix/${ingredientId}`,
      { prix },
    );
  }

  dupliquerVersActivite(produitId: string, activiteDestId: string): Observable<Product> {
    return this.http.post<Product>(`/api/produits/${produitId}/dupliquer`, { activiteDestId });
  }
}
