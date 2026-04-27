import { Ingredient } from './catalogue.model';

export type MouvementType = 'ACHAT' | 'CONSOMMATION' | 'AJUSTEMENT' | 'TRANSFERT_IN' | 'TRANSFERT_OUT';

export interface StockItem {
  id: string;
  ingredientId: string;
  ingredient: Ingredient;
  activiteId: string;
  quantite: number;
  seuilMinimum: number;
  isAlerte: boolean;
  updatedAt?: string;
}

export interface Mouvement {
  id: string;
  ingredientId: string;
  ingredient?: Ingredient;
  activiteId: string;
  type: MouvementType;
  quantite: number;
  note?: string;
  createdAt: string;
  createdByUserId?: string;
}

export interface MouvementRequest {
  ingredientId: string;
  type: MouvementType;
  quantite: number;
  note?: string;
}

export interface TransfertRequest {
  ingredientId: string;
  activiteDestId: string;
  quantite: number;
  note?: string;
}

export interface MouvementFilter {
  ingredientId?: string;
  type?: MouvementType;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  pageSize?: number;
}

export interface InventaireSession {
  id: string;
  activiteId: string;
  date: string;
  statut: 'EN_COURS' | 'VALIDE';
  lignes?: InventaireLigne[];
  createdAt: string;
}

export interface InventaireLigne {
  id: string;
  sessionId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantiteTheorique: number;
  quantiteReelle: number | null;
  delta?: number;
}

export interface IngredientAssignation {
  activiteId: string;
  ingredientIds: string[];
}

export interface Transfert {
  id: string;
  ingredientId: string;
  ingredient?: import('./catalogue.model').Ingredient;
  activiteSourceId: string;
  activiteSource?: { id: string; name: string };
  activiteDestId: string;
  activiteDest?: { id: string; name: string };
  quantite: number;
  note?: string;
  createdAt: string;
}

export interface TransfertFilter {
  activiteId?: string;
  ingredientId?: string;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  pageSize?: number;
}
