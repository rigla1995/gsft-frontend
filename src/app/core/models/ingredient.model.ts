export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  tenantId?: string;
  activityId?: string;
}

export interface StockEntry {
  ingredientId: string;
  ingredient: Ingredient;
  quantity: number;
  activityId: string;
}

export interface Transfer {
  id: string;
  fromActivityId: string;
  toActivityId: string;
  ingredientId: string;
  ingredient: Ingredient;
  quantity: number;
  notes?: string;
  createdAt: string;
  createdByUserId: string;
}
