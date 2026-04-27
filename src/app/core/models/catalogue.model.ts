export interface Unite {
  id: string;
  name: string;
  symbol: string;
  createdAt?: string;
}

export interface Categorie {
  id: string;
  name: string;
  domaine?: string;
  domaineId?: string;
  createdAt?: string;
}

export interface Domaine {
  id: string;
  name: string;
  createdAt?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  categorieId: string;
  categorie?: Categorie;
  unitId: string;
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
