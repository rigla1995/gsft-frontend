export interface Activity {
  id: string;
  name: string;
  code: string;
  tenantId: string;
  type: ActivityType;
  isActive: boolean;
}

export enum ActivityType {
  FRANCHISE = 'FRANCHISE',
  DISTINCT = 'DISTINCT',
  LABO = 'LABO',
}
