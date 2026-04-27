import { Ingredient } from './catalogue.model';

export type ProductType = 'SELLABLE' | 'USABLE';

export interface Product {
  id: string;
  nom: string;
  type: ProductType;
  prixVente?: number;
  activiteId?: string;
  recette?: RecetteLigne[];
  cout?: number;
  createdAt?: string;
}

export interface RecetteLigne {
  id?: string;
  produitId?: string;
  type: 'INGREDIENT' | 'PRODUIT';
  ingredientId?: string;
  ingredient?: Ingredient;
  sousProduitId?: string;
  sousProduit?: Product;
  quantite: number;
  unite?: string;
  prixUnitaire?: number;
}

export interface FicheTechnique {
  produitId: string;
  produit: Product;
  lignes: FicheTechniqueLigne[];
  coutTotal: number;
  margePercent?: number;
}

export interface FicheTechniqueLigne {
  ingredientId: string;
  ingredient: Ingredient;
  quantite: number;
  prixUnitaire: number;
  prixOverride?: number;
  prixEffectif: number;
  coutLigne: number;
}
