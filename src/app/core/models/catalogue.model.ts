export interface Unite {
  id: string;
  nom: string;
  symbole: string;
  createdAt?: string;
}

export interface Categorie {
  id: string;
  nom: string;
  domaine?: string;
  domaineId?: string;
  createdAt?: string;
}

export interface Domaine {
  id: string;
  nom: string;
  createdAt?: string;
}

export interface Ingredient {
  id: string;
  nom: string;
  categorieId: string;
  categorie?: Categorie;
  uniteId: string;
  unite?: Unite;
  domaineId?: string;
  domaine?: Domaine;
  prixUnitaire?: number;
  createdAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IngredientFilter {
  search?: string;
  categorieId?: string;
  domaineId?: string;
  page?: number;
  pageSize?: number;
}
